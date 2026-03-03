package com.nexorcrm.backend.service;

import com.nexorcrm.backend.config.JwtUtil;
import com.nexorcrm.backend.dto.ChangePasswordRequest;
import com.nexorcrm.backend.dto.CompleteProfileRequest;
import com.nexorcrm.backend.dto.ForceChangePasswordRequest;
import com.nexorcrm.backend.dto.LoginRequest;
import com.nexorcrm.backend.dto.LoginResponse;
import com.nexorcrm.backend.entity.ActivationStatus;
import com.nexorcrm.backend.entity.RefreshToken;
import com.nexorcrm.backend.entity.User;
import com.nexorcrm.backend.repo.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final SecuritySettingsService securitySettingsService;
    private final AuditService auditService;
    private final HttpServletRequest request;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       RefreshTokenService refreshTokenService,
                       SecuritySettingsService securitySettingsService,
                       AuditService auditService,
                       HttpServletRequest request) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.securitySettingsService = securitySettingsService;
        this.auditService = auditService;
        this.request = request;
    }

    public LoginResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        String loginIp = resolveIpAddress();
        if (securitySettingsService.isIpBanned(loginIp)) {
            throw new AccessDeniedException("Login is blocked from this IP address");
        }
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new BadCredentialsException("Invalid username/email or password"));

        if (user.isDeleted()) {
            throw new AccessDeniedException("This account has been deleted");
        }

        if (user.getActivationStatus() == ActivationStatus.PENDING) {
            throw new AccessDeniedException("Your account is awaiting admin activation");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username/email or password");
        }

        if (!user.isActive()) {
            throw new DisabledException("Account is deactivated");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setLastActiveIp(loginIp);
        if (!StringUtils.hasText(user.getRegisteredIp())) {
            user.setRegisteredIp(loginIp);
        }
        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        auditService.logAsActor("LOGIN", user.getEmail(), "User login", user.getEmail());
        return toLoginResponse(user, accessToken, refreshToken.getToken());
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            throw new com.nexorcrm.backend.exception.TokenRefreshException();
        }
        RefreshToken verified = refreshTokenService.verifyRefreshToken(refreshToken);
        User user = verified.getUser();
        if (user.isDeleted()) {
            throw new AccessDeniedException("This account has been deleted");
        }
        if (user.getActivationStatus() == ActivationStatus.PENDING) {
            throw new AccessDeniedException("Your account is awaiting admin activation");
        }
        String accessToken = jwtUtil.generateAccessToken(user);
        return toLoginResponse(user, accessToken, refreshToken);
    }

    public String changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setForcePasswordChange(false);
        userRepository.save(user);

        refreshTokenService.revokeAllUserTokens(user);
        auditService.log("PASSWORD_CHANGED", "User changed password", user.getEmail());
        return "Password changed successfully";
    }

    public String forceChangePassword(String principal, ForceChangePasswordRequest request) {
        User user = resolveCurrentUser(principal);
        String newPassword = request.getNewPassword().trim();
        String confirmPassword = request.getConfirmPassword().trim();

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalStateException("New password and confirm password do not match");
        }
        if (!user.isForcePasswordChange()) {
            throw new AccessDeniedException("Forced password change is not required");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setForcePasswordChange(false);
        userRepository.save(user);

        refreshTokenService.revokeAllUserTokens(user);
        auditService.log("FORCE_PASSWORD_CHANGED", "User changed forced temporary password", user.getEmail());
        return "Password changed successfully";
    }

    public String logout(String refreshToken, String principal) {
        if (StringUtils.hasText(refreshToken)) {
            refreshTokenService.revokeRefreshToken(refreshToken);
        }
        String targetUser = null;
        if (StringUtils.hasText(principal)) {
            try {
                targetUser = resolveCurrentUser(principal).getEmail();
            } catch (Exception ignored) {
                // Keep logout resilient even if principal cannot be resolved.
            }
        }
        auditService.logAsActor("LOGOUT", targetUser, "User logout", targetUser);
        return "Logged out successfully";
    }

    public String completeProfile(String principal, CompleteProfileRequest request) {
        User user = resolveCurrentUser(principal);
        String firstName = request.getFirstName() == null ? "" : request.getFirstName().trim();
        String lastName = request.getLastName() == null ? "" : request.getLastName().trim();

        if (!StringUtils.hasText(firstName) || !StringUtils.hasText(lastName)) {
            throw new IllegalStateException("First Name and Last Name are required");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.save(user);
        auditService.log("PROFILE_COMPLETED", "Completed required profile fields", user.getEmail());
        return "Profile completed successfully";
    }

    private LoginResponse toLoginResponse(User user, String accessToken, String refreshToken) {
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().name());
        response.setInstitution(user.getInstitutionName());
        response.setInstitutionCategory(user.getInstitutionCategory());
        response.setInstitutionType(user.getInstitutionType());
        response.setDepartmentName(user.getDepartmentName());
        response.setTeam(user.getTeamName());
        response.setForcePasswordChange(user.isForcePasswordChange());
        response.setProfileIncomplete(isProfileIncomplete(user));
        return response;
    }

    private boolean isProfileIncomplete(User user) {
        return !StringUtils.hasText(user.getFirstName()) || !StringUtils.hasText(user.getLastName());
    }

    private User resolveCurrentUser(String principal) {
        if (!StringUtils.hasText(principal)) {
            throw new EntityNotFoundException("User not found");
        }
        if (principal.contains("@")) {
            return userRepository.findByEmailAndIsDeletedFalse(principal.trim().toLowerCase())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
        }
        return userRepository.findByUsernameAndIsDeletedFalse(principal.trim())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private String resolveIpAddress() {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            int comma = forwarded.indexOf(',');
            return comma > -1 ? forwarded.substring(0, comma).trim() : forwarded.trim();
        }
        return request.getRemoteAddr();
    }
}
