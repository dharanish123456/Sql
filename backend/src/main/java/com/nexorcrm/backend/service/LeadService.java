
package com.nexorcrm.backend.service;

import com.nexorcrm.backend.dto.LeadAllocatorOptionResponse;
import com.nexorcrm.backend.dto.LeadAssignableGroupResponse;
import com.nexorcrm.backend.dto.LeadCreateRequest;
import com.nexorcrm.backend.dto.LeadFiltersResponse;
import com.nexorcrm.backend.dto.LeadLogResponse;
import com.nexorcrm.backend.dto.LeadResponse;
import com.nexorcrm.backend.dto.LeadUpdateAllocatorRequest;
import com.nexorcrm.backend.dto.LeadUpdateStatusRequest;
import com.nexorcrm.backend.dto.LeadUpdateDetailsRequest;
import com.nexorcrm.backend.dto.PaymentRequest;
import com.nexorcrm.backend.entity.ActivationStatus;
import com.nexorcrm.backend.entity.ChannelPartner;
import com.nexorcrm.backend.entity.Lead;
import com.nexorcrm.backend.entity.LeadLog;
import com.nexorcrm.backend.entity.Role;
import com.nexorcrm.backend.entity.User;
import com.nexorcrm.backend.entity.UserGroup;
import com.nexorcrm.backend.entity.UserGroupMember;
import com.nexorcrm.backend.repo.ChannelPartnerRepository;
import com.nexorcrm.backend.repo.LeadRepository;
import com.nexorcrm.backend.repo.LeadLogRepository;
import com.nexorcrm.backend.repo.LeadStatusRepository;
import com.nexorcrm.backend.repo.LeadTypeRepository;
import com.nexorcrm.backend.repo.UserGroupMemberRepository;
import com.nexorcrm.backend.repo.UserGroupRepository;
import com.nexorcrm.backend.repo.UserRepository;
import com.nexorcrm.backend.security.RolePermissionUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeadService {

    private static final String LEADS_PAGE_KEY = "leads";
    private static final Comparator<UserGroup> GROUP_ORDER_COMPARATOR =
            Comparator.comparing((UserGroup g) -> g.getGroupLevel() == null ? Integer.MAX_VALUE : g.getGroupLevel())
                    .thenComparing(g -> StringUtils.hasText(g.getName()) ? g.getName().toLowerCase(Locale.ROOT) : "")
                    .thenComparing(g -> g.getId() == null ? Long.MAX_VALUE : g.getId());

    private final LeadRepository leadRepository;
    private final LeadLogRepository leadLogRepository;
    private final ChannelPartnerRepository channelPartnerRepository;
    private final LeadStatusRepository leadStatusRepository;
    private final LeadTypeRepository leadTypeRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupMemberRepository userGroupMemberRepository;
    private final AuditService auditService;
    private final LeadFlowService leadFlowService;
    private final LeadChatService leadChatService;
    private static final String DEFAULT_CUSTOMER_PASSWORD = "Customer@123";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public LeadService(LeadRepository leadRepository,
                       LeadLogRepository leadLogRepository,
                       ChannelPartnerRepository channelPartnerRepository,
                       LeadStatusRepository leadStatusRepository,
                       LeadTypeRepository leadTypeRepository,
                       UserRepository userRepository,
                       UserGroupRepository userGroupRepository,
                       UserGroupMemberRepository userGroupMemberRepository,
                       AuditService auditService,
                       LeadFlowService leadFlowService,
                       LeadChatService leadChatService) {
        this.leadRepository = leadRepository;
        this.leadLogRepository = leadLogRepository;
        this.channelPartnerRepository = channelPartnerRepository;
        this.leadStatusRepository = leadStatusRepository;
        this.leadTypeRepository = leadTypeRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.userGroupMemberRepository = userGroupMemberRepository;
        this.auditService = auditService;
        this.leadFlowService = leadFlowService;
        this.leadChatService = leadChatService;
    }

    /**
     * Handle a payment request coming from a customer.
     * Updates the paid and remaining amounts on the associated lead.
     */
    public LeadResponse recordCustomerPayment(String customerEmail, com.nexorcrm.backend.dto.PaymentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Payment request required");
        }
        String type = request.getType() == null ? "" : request.getType().trim().toLowerCase();
        BigDecimal amt = request.getAmount();
        // if amount is missing/zero and caller asked for a full payment, default to
        // whatever remains on the lead
        if ((amt == null || amt.compareTo(BigDecimal.ZERO) <= 0) && "full".equals(type)) {
            // will resolve later once we have the lead row
        } else if (amt == null || amt.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }
        String emailNormalized = normalizeEmail(customerEmail);
        Lead row = leadRepository.findTopByDeletedFalseAndEmailNormalizedOrderByCreatedAtDesc(emailNormalized)
                .orElseThrow(() -> new EntityNotFoundException("Customer lead not found"));

        if (row.getStatus() == null || !row.getStatus().equalsIgnoreCase("payment")) {
            throw new IllegalStateException("Lead is not in payment status");
        }

        if ((amt == null || amt.compareTo(BigDecimal.ZERO) <= 0) && "full".equals(type)) {
            // pay remaining amount (fallback to total if remaining is null)
            amt = row.getRemainingAmount();
            if (amt == null || amt.compareTo(BigDecimal.ZERO) <= 0) {
                amt = row.getTotalAmount();
            }
        }
        if (amt == null || amt.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }

        BigDecimal paid = row.getPaidAmount() == null ? BigDecimal.ZERO : row.getPaidAmount();
        paid = paid.add(amt);
        row.setPaidAmount(paid);
        if (row.getTotalAmount() != null) {
            BigDecimal rem = row.getTotalAmount().subtract(paid);
            row.setRemainingAmount(rem.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : rem);
        }

        Lead saved = leadRepository.save(row);
        Map<Long, String> cpNameMap = new HashMap<>();
        if (saved.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }
        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));
        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> list(String actorPrincipal,
                                   String search,
                                   String project,
                                   String primary,
                                   String status,
                                   String svStatus,
                                   String owner,
                                   String quickDate) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        boolean paymentFilter = StringUtils.hasText(status) && status.equalsIgnoreCase("payment");
        List<Lead> rows = leadRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
                .filter(row -> canViewLead(actor, row, visibleGroupIds))
                .filter(row -> containsIgnoreCase(row.getName(), search)
                        || containsIgnoreCase(row.getMobile(), search)
                        || containsIgnoreCase(row.getEmail(), search))
                .filter(row -> equalsIgnoreCase(row.getProjectName(), project))
                .filter(row -> equalsIgnoreCase(row.getPrimarySource(), primary))
                .filter(row -> {
                    if (paymentFilter) {
                        // show all leads in payment status plus any lead that has
                        // been moved into design while preserving the payment owner
                        if ("payment".equalsIgnoreCase(row.getStatus())) {
                            return true;
                        }
                        if ("design".equalsIgnoreCase(row.getStatus())
                                && row.getPaymentOwnerId() != null
                                && Objects.equals(row.getPaymentOwnerId(), actor.getId())) {
                            return true;
                        }
                        return false;
                    }
                    return equalsIgnoreCase(row.getStatus(), status);
                })
                .filter(row -> equalsIgnoreCase(row.getSvStatus(), svStatus))
                .filter(row -> equalsIgnoreCase(row.getOwner(), owner))
                .filter(row -> matchQuickDate(row.getCreatedAt(), quickDate))
                .toList();

        Map<Long, String> cpNameMap = loadChannelPartnerNameMap(rows);
        Map<Long, String> groupNameMap = loadGroupNameMap(rows);
        Map<Long, String> userNameMap = loadUserNameMap(rows);

        return rows.stream()
                .map(row -> toResponse(row, cpNameMap, groupNameMap, userNameMap))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> listByChannelPartner(String actorPrincipal, Long channelPartnerId) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        channelPartnerRepository.findByIdAndDeletedFalse(channelPartnerId)
                .orElseThrow(() -> new EntityNotFoundException("Channel partner not found"));

        List<Lead> rows = leadRepository.findByDeletedFalseAndChannelPartnerIdOrderByCreatedAtDesc(channelPartnerId)
                .stream()
                .filter(row -> canViewLead(actor, row, visibleGroupIds))
                .toList();

        Map<Long, String> cpNameMap = loadChannelPartnerNameMap(rows);
        Map<Long, String> groupNameMap = loadGroupNameMap(rows);
        Map<Long, String> userNameMap = loadUserNameMap(rows);

        return rows.stream()
                .map(row -> toResponse(row, cpNameMap, groupNameMap, userNameMap))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeadResponse getById(Long id, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead row = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, row, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to access this lead");
        }

        Map<Long, String> cpNameMap = new HashMap<>();
        if (row.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(row.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }

        Map<Long, String> groupNameMap = new HashMap<>();
        if (row.getAssignedGroupId() != null) {
            userGroupRepository.findById(row.getAssignedGroupId()).ifPresent(group -> groupNameMap.put(group.getId(), group.getName()));
        }

        Map<Long, String> userNameMap = new HashMap<>();
        if (row.getAllocatorUserId() != null) {
            userRepository.findById(row.getAllocatorUserId()).ifPresent(user -> userNameMap.put(user.getId(), user.getUsername()));
        }
        if (row.getOwnerUserId() != null) {
            userRepository.findById(row.getOwnerUserId()).ifPresent(user -> userNameMap.put(user.getId(), user.getUsername()));
        }

        return toResponse(row, cpNameMap, groupNameMap, userNameMap);
    }

    @Transactional(readOnly = true)
    public LeadFiltersResponse filters(String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        List<Lead> all = leadRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
                .filter(row -> canViewLead(actor, row, visibleGroupIds))
                .toList();

        LeadFiltersResponse out = new LeadFiltersResponse();
        out.setProjects(distinctSorted(all.stream().map(Lead::getProjectName).toList()));
        out.setPrimarySources(distinctSorted(all.stream().map(Lead::getPrimarySource).toList()));
        out.setLeadStatuses(distinctSorted(all.stream().map(Lead::getStatus).toList()));
        out.setSvStatuses(distinctSorted(all.stream().map(Lead::getSvStatus).toList()));
        out.setOwners(distinctSorted(all.stream().map(Lead::getOwner).toList()));
        return out;
    }

    @Transactional(readOnly = true)
    public List<LeadAssignableGroupResponse> listAssignableGroups(String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        List<UserGroup> groups;
        if (actor.getRole() == Role.SUPER_ADMIN) {
            // flow editor should be able to pick any group, even if the group
            // itself not yet marked as lead-visible.  previously the call
            // delegated to findLeadVisibleGroupsForActor which filtered out such
            // groups, causing freshly created groups to disappear from the dropdown.
            groups = userGroupRepository.findAllByOrderByGroupLevelAscNameAsc();
        } else {
            groups = findLeadVisibleGroupsForActor(actor);
        }
        return groups.stream()
                .map(this::toAssignableGroupResponse)
                .toList();
    }

    public LeadResponse create(LeadCreateRequest request, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Long flowGroupId = resolveFlowGroupForStatus("New Lead");
        Long groupId = flowGroupId != null ? flowGroupId : request.getLeadGroupId();
        UserGroup selectedGroup = resolveLeadGroupForCreate(actor, groupId);
        User ownerUser = resolveLeadOwnerForCreate(actor, selectedGroup);

        String projectName = normalizeNullable(request.getProjectName());
        String email = normalizeNullable(request.getEmail());
        String emailNormalized = normalizeEmail(email);
        String countryCode = normalizeNullable(request.getCountryCode());
        String mobile = request.getMobile().trim();
        String primarySource = request.getPrimarySource().trim();
        String mobileNormalized = normalizeMobile(mobile);
        if (!StringUtils.hasText(mobileNormalized)) {
            throw new IllegalStateException("Mobile is required");
        }

        Long channelPartnerId = null;
        if ("channel partner".equalsIgnoreCase(primarySource)) {
            if (request.getChannelPartnerId() == null) {
                throw new IllegalStateException("Channel Partner is required when Primary Source is Channel Partner");
            }
            ChannelPartner channelPartner = channelPartnerRepository.findByIdAndDeletedFalse(request.getChannelPartnerId())
                    .orElseThrow(() -> new EntityNotFoundException("Channel partner not found"));
            channelPartnerId = channelPartner.getId();
        }

        boolean duplicateByMobile = false;
        boolean duplicateByEmail = false;
        if (StringUtils.hasText(projectName)) {
            duplicateByMobile = leadRepository.existsByDeletedFalseAndProjectNameIgnoreCaseAndMobileNormalized(projectName, mobileNormalized);
            if (StringUtils.hasText(emailNormalized)) {
                duplicateByEmail = leadRepository.existsByDeletedFalseAndProjectNameIgnoreCaseAndEmailNormalized(projectName, emailNormalized);
            }
        }

        Lead row = new Lead();
        row.setLeadId("LEAD_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14).toUpperCase(Locale.ROOT));
        row.setEuid(leadRepository.countByDeletedFalse() + 1);
        row.setName(request.getName().trim());
        row.setEmail(email);
        row.setEmailNormalized(emailNormalized);
        row.setCountryCode(countryCode);
        row.setMobile(mobile);
        row.setMobileNormalized(mobileNormalized);
        row.setPrimarySource(primarySource);
        row.setSecondarySource(normalizeNullable(request.getSecondarySource()));
        row.setTertiarySource(normalizeNullable(request.getTertiarySource()));
        row.setProjectName(projectName);
        row.setChannelPartnerId(channelPartnerId);
        row.setStatus((duplicateByMobile || duplicateByEmail) ? "Duplicate" : "New Lead");
        row.setSvStatus(null);
        row.setAssignedGroupId(selectedGroup.getId());
        row.setAllocatorUserId(actor.getId());
        row.setOwnerUserId(ownerUser.getId());
        row.setOwner(ownerUser.getUsername());

        Lead saved = leadRepository.save(row);
        auditService.log("LEAD_CREATE", "Created lead with status " + saved.getStatus(), actor.getEmail());
        createLeadLog(saved.getId(), "Call Log Created", actor);

        Map<Long, String> cpNameMap = new HashMap<>();
        if (channelPartnerId != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(channelPartnerId).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }

        Map<Long, String> groupNameMap = new HashMap<>();
        groupNameMap.put(selectedGroup.getId(), selectedGroup.getName());

        Map<Long, String> userNameMap = new HashMap<>();
        userNameMap.put(actor.getId(), actor.getUsername());
        userNameMap.put(ownerUser.getId(), ownerUser.getUsername());

        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    public LeadResponse updateStatus(Long id, LeadUpdateStatusRequest request, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead row = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, row, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to update this lead");
        }
        if (!canEditLead(actor, row)) {
            throw new AccessDeniedException("Only the current owner can update status for this lead");
        }

        String status = request.getStatus().trim();
        if (!leadStatusRepository.existsByStatusNameIgnoreCaseAndDeletedFalse(status)) {
            throw new IllegalStateException("Invalid lead status");
        }

        // special case: transitioning to Stock Requested is just a label change
        // for the lead; we do *not* want to reassign the lead to the accounts
        // group or touch its owner. the stock request record itself is
        // responsible for assignment. just save the status and skip the flow
        // logic entirely.
        if ("stock requested".equalsIgnoreCase(status)) {
            row.setStatus(status);
            Lead saved = leadRepository.save(row);
            auditService.log("LEAD_STATUS_UPDATE", "Updated lead status to " + saved.getStatus(), actor.getEmail());
            createLeadLog(saved.getId(), "Status changed to " + saved.getStatus(), actor);

            Map<Long, String> cpNameMap = new HashMap<>();
            if (saved.getChannelPartnerId() != null) {
                channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                        cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
            }
            Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
            Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));
            return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
        }

        // if switching from payment into either design or production remember
        // the original payment owner before we potentially overwrite the owner via
        // the round‑robin assignment done by applyFlowStatusTransition. the
        // frontend already takes care of storing the owner as well but keeping it
        // here makes the behaviour consistent for any callers that bypass the UI.
        if ("payment".equalsIgnoreCase(row.getStatus())
                && ("design".equalsIgnoreCase(status) || "production".equalsIgnoreCase(status))
                && row.getOwnerUserId() != null) {
            row.setPaymentOwnerId(row.getOwnerUserId());
        }

        applyFlowStatusTransition(row, status, request.getNextGroupId());
        // when moving back to payment restore previous owner if present
        if ("payment".equalsIgnoreCase(status)) {
            if (row.getPaymentOwnerId() != null) {
                row.setOwnerUserId(row.getPaymentOwnerId());
                row.setOwner(resolveOwnerName(userRepository.findById(row.getPaymentOwnerId()).orElse(null)));
                row.setPaymentOwnerId(null);
            }
        } else if (!"design".equalsIgnoreCase(status) && !"production".equalsIgnoreCase(status)) {
            row.setPaymentOwnerId(null);
        }
        Lead saved = leadRepository.save(row);
        auditService.log("LEAD_STATUS_UPDATE", "Updated lead status", actor.getEmail());
        createLeadLog(saved.getId(), "Status changed to " + saved.getStatus(), actor);

        Map<Long, String> cpNameMap = new HashMap<>();
        if (saved.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }

        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));

        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    @Transactional(readOnly = true)
    public List<LeadAllocatorOptionResponse> listAssignableAllocators(Long leadId, Long targetGroupId, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead lead = leadRepository.findByIdAndDeletedFalse(leadId)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, lead, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to access this lead");
        }

        Long effectiveGroupId = lead.getAssignedGroupId();
        if (targetGroupId != null) {
            Long allowedGroupId = resolveFlowNextGroupId(lead.getStatus(), "Allocate");
            if (allowedGroupId == null || !allowedGroupId.equals(targetGroupId)) {
                throw new AccessDeniedException("You do not have permission to assign this allocator");
            }
            effectiveGroupId = allowedGroupId;
        }

        boolean groupedLead = effectiveGroupId != null;
        if (actor.getRole() == Role.SUPER_ADMIN && groupedLead) {
            List<UserGroupMember> groupMembers = userGroupRepository.findById(effectiveGroupId)
                    .map(userGroupMemberRepository::findByGroupOrderByUserUsernameAsc)
                    .orElse(List.of());

            List<User> groupEmployees = groupMembers.stream()
                    .filter(this::memberHasLeadVisibility)
                    .map(UserGroupMember::getUser)
                    .filter(Objects::nonNull)
                    .filter(User::isActive)
                    .filter(user -> user.getActivationStatus() == ActivationStatus.ACTIVE)
                    .filter(user -> user.getRole() == Role.EMPLOYEE)
                    .toList();

            List<LeadAllocatorOptionResponse> out = new java.util.ArrayList<>(groupMembers.stream()
                    .filter(this::memberHasLeadVisibility)
                    .map(UserGroupMember::getUser)
                    .filter(Objects::nonNull)
                    .filter(User::isActive)
                    .filter(user -> user.getActivationStatus() == ActivationStatus.ACTIVE)
                    .map(this::toAllocatorOptionResponse)
                    .toList());

            Set<Long> seen = out.stream()
                    .map(LeadAllocatorOptionResponse::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            List<User> managersAdmins = userRepository
                    .findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                            List.of(Role.MANAGER, Role.ADMIN),
                            ActivationStatus.ACTIVE
                    ).stream()
                    .filter(User::isActive)
                    .filter(candidate -> (candidate.getRole() == Role.MANAGER && isAssociatedManager(candidate, groupEmployees))
                            || (candidate.getRole() == Role.ADMIN && isAssociatedAdmin(candidate, groupEmployees)))
                    .toList();

            for (User candidate : managersAdmins) {
                if (candidate.getId() == null || !seen.add(candidate.getId())) {
                    continue;
                }
                out.add(toAllocatorOptionResponse(candidate));
            }

            return out;
        }
        if ((actor.getRole() == Role.EMPLOYEE || actor.getRole() == Role.ADMIN || actor.getRole() == Role.MANAGER) && groupedLead) {
            if (actor.getRole() == Role.ADMIN || actor.getRole() == Role.MANAGER) {
                List<UserGroupMember> groupMembers = userGroupRepository.findById(effectiveGroupId)
                        .map(userGroupMemberRepository::findByGroupOrderByUserUsernameAsc)
                        .orElse(List.of());

                List<User> groupEmployees = groupMembers.stream()
                        .filter(this::memberHasLeadVisibility)
                        .map(UserGroupMember::getUser)
                        .filter(Objects::nonNull)
                        .filter(User::isActive)
                        .filter(user -> user.getActivationStatus() == ActivationStatus.ACTIVE)
                        .filter(user -> user.getRole() == Role.EMPLOYEE)
                        .toList();

                List<LeadAllocatorOptionResponse> out = new java.util.ArrayList<>(
                        groupEmployees.stream()
                                .map(this::toAllocatorOptionResponse)
                                .toList()
                );

                Set<Long> seen = out.stream()
                        .map(LeadAllocatorOptionResponse::getId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                if (actor.getRole() == Role.ADMIN) {
                    List<User> managers = userRepository
                            .findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                                    List.of(Role.MANAGER),
                                    ActivationStatus.ACTIVE
                            ).stream()
                            .filter(User::isActive)
                            .filter(candidate -> isAssociatedManager(candidate, groupEmployees))
                            .toList();
                    for (User candidate : managers) {
                        if (candidate.getId() == null || !seen.add(candidate.getId())) {
                            continue;
                        }
                        out.add(toAllocatorOptionResponse(candidate));
                    }
                }

                if (actor.getRole() == Role.MANAGER) {
                    List<User> admins = userRepository
                            .findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                                    List.of(Role.ADMIN),
                                    ActivationStatus.ACTIVE
                            ).stream()
                            .filter(User::isActive)
                            .filter(candidate -> isSameDepartmentScope(actor, candidate))
                            .toList();
                    for (User candidate : admins) {
                        if (candidate.getId() == null || !seen.add(candidate.getId())) {
                            continue;
                        }
                        out.add(toAllocatorOptionResponse(candidate));
                    }
                }

                return out;
            }
            List<LeadAllocatorOptionResponse> employees = userGroupMemberRepository
                    .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                            effectiveGroupId,
                            Role.EMPLOYEE,
                            ActivationStatus.ACTIVE
                    ).stream()
                    .filter(this::memberHasLeadVisibility)
                    .map(UserGroupMember::getUser)
                    .filter(Objects::nonNull)
                    .map(this::toAllocatorOptionResponse)
                    .toList();

            List<User> groupManagersAdmins = userGroupRepository.findById(effectiveGroupId)
                    .map(userGroupMemberRepository::findByGroupOrderByUserUsernameAsc)
                    .orElse(List.of())
                    .stream()
                    .filter(this::memberHasLeadVisibility)
                    .map(UserGroupMember::getUser)
                    .filter(Objects::nonNull)
                    .filter(user -> user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER)
                    .filter(User::isActive)
                    .filter(user -> user.getActivationStatus() == ActivationStatus.ACTIVE)
                    .toList();

            List<User> managersAdmins = userRepository
                    .findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                            List.of(Role.MANAGER, Role.ADMIN),
                            ActivationStatus.ACTIVE
                    ).stream()
                    .filter(User::isActive)
                    .filter(candidate -> (candidate.getRole() == Role.MANAGER && isSameTeamScope(actor, candidate))
                            || (candidate.getRole() == Role.ADMIN && isSameDepartmentScope(actor, candidate)))
                    .toList();

            List<LeadAllocatorOptionResponse> out = new java.util.ArrayList<>(employees);
            Set<Long> seen = new HashSet<>();
            for (LeadAllocatorOptionResponse res : out) {
                if (res.getId() != null) {
                    seen.add(res.getId());
                }
            }
            for (User candidate : groupManagersAdmins) {
                if (candidate.getId() != null && !seen.add(candidate.getId())) {
                    continue;
                }
                out.add(toAllocatorOptionResponse(candidate));
            }
            for (User candidate : managersAdmins) {
                if (candidate.getId() != null && !seen.add(candidate.getId())) {
                    continue;
                }
                out.add(toAllocatorOptionResponse(candidate));
            }
            return out;
        }

        List<User> candidates = userRepository.findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                RolePermissionUtil.getVisibleRoles(actor.getRole()),
                ActivationStatus.ACTIVE
        );

        Set<Long> groupedEligibleOwnerIds = groupedLead
                ? userGroupMemberRepository
                .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                        effectiveGroupId,
                        Role.EMPLOYEE,
                        ActivationStatus.ACTIVE
                ).stream()
                .filter(this::memberHasLeadVisibility)
                .map(UserGroupMember::getUser)
                .filter(Objects::nonNull)
                .map(User::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet())
                : Set.of();

        return candidates.stream()
                .filter(User::isActive)
                .filter(candidate -> canAssignAllocator(actor, candidate))
                .filter(candidate -> !groupedLead || groupedEligibleOwnerIds.contains(candidate.getId()))
                .map(this::toAllocatorOptionResponse)
                .toList();
    }

    public LeadResponse updateAllocator(Long leadId, LeadUpdateAllocatorRequest request, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead row = leadRepository.findByIdAndDeletedFalse(leadId)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, row, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to update this lead");
        }

        if (request.getTargetGroupId() != null) {
            Long allowedGroupId = resolveFlowNextGroupId(row.getStatus(), "Allocate");
            if (allowedGroupId == null || !allowedGroupId.equals(request.getTargetGroupId())) {
                throw new AccessDeniedException("You do not have permission to assign this allocator");
            }
            row.setAssignedGroupId(allowedGroupId);
        }

        if (actor.getRole() == Role.EMPLOYEE && !Objects.equals(row.getOwnerUserId(), actor.getId())) {
            throw new AccessDeniedException("Only the current owner can allocate this lead");
        }

        User ownerUser = userRepository.findByIdAndIsDeletedFalse(request.getOwnerUserId())
                .orElseThrow(() -> new EntityNotFoundException("Allocator user not found"));
        if (!ownerUser.isActive() || ownerUser.getActivationStatus() != ActivationStatus.ACTIVE) {
            throw new IllegalStateException("Selected allocator must be an active user");
        }
        if (actor.getRole() == Role.ADMIN || actor.getRole() == Role.MANAGER) {
            if (ownerUser.getRole() == Role.EMPLOYEE) {
                // allowed (group employee) - validated later
            } else if (actor.getRole() == Role.ADMIN && ownerUser.getRole() == Role.MANAGER) {
                if (!isAssociatedManager(ownerUser, loadGroupEmployees(row))) {
                    throw new AccessDeniedException("You do not have permission to assign this allocator");
                }
            } else if (actor.getRole() == Role.MANAGER && ownerUser.getRole() == Role.ADMIN) {
                if (!isSameDepartmentScope(actor, ownerUser)) {
                    throw new AccessDeniedException("You do not have permission to assign this allocator");
                }
            } else {
                throw new AccessDeniedException("You do not have permission to assign this allocator");
            }
        } else if (actor.getRole() == Role.EMPLOYEE && !canEmployeeAllocateTo(actor, ownerUser, row)) {
            throw new AccessDeniedException("You do not have permission to assign this allocator");
        } else if (actor.getRole() != Role.SUPER_ADMIN && actor.getRole() != Role.EMPLOYEE) {
            if (!canAssignAllocator(actor, ownerUser)) {
                throw new AccessDeniedException("You do not have permission to assign this allocator");
            }
        }

        if (actor.getRole() == Role.SUPER_ADMIN && row.getAssignedGroupId() != null) {
            List<User> groupEmployees = loadGroupEmployees(row);
            boolean allowed = false;
            if (ownerUser.getRole() == Role.EMPLOYEE) {
                allowed = groupEmployees.stream().anyMatch(emp -> Objects.equals(emp.getId(), ownerUser.getId()));
            } else if (ownerUser.getRole() == Role.MANAGER) {
                allowed = isAssociatedManager(ownerUser, groupEmployees);
            } else if (ownerUser.getRole() == Role.ADMIN) {
                allowed = isAssociatedAdmin(ownerUser, groupEmployees);
            }
            if (!allowed) {
                throw new AccessDeniedException("You do not have permission to assign this allocator");
            }
        }

        if (row.getAssignedGroupId() != null && ownerUser.getRole() == Role.EMPLOYEE && actor.getRole() != Role.SUPER_ADMIN) {
            List<UserGroupMember> eligibleOwners = userGroupMemberRepository
                    .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                            row.getAssignedGroupId(),
                            Role.EMPLOYEE,
                            ActivationStatus.ACTIVE
                    );
            boolean isEligible = eligibleOwners.stream()
                    .filter(this::memberHasLeadVisibility)
                    .map(UserGroupMember::getUser)
                    .filter(Objects::nonNull)
                    .anyMatch(member -> Objects.equals(member.getId(), ownerUser.getId()));
            if (!isEligible) {
                throw new IllegalStateException("Selected owner must be an active employee in the lead group");
            }
        }

        row.setOwnerUserId(ownerUser.getId());
        row.setOwner(ownerUser.getUsername());
        Lead saved = leadRepository.save(row);
        auditService.log("LEAD_ALLOCATOR_UPDATE", "Updated lead allocator", actor.getEmail());
        createLeadLog(saved.getId(), "Owner changed to " + ownerUser.getUsername(), actor);

        Map<Long, String> cpNameMap = new HashMap<>();
        if (saved.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }

        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));

        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    public LeadResponse updateDetails(Long id, LeadUpdateDetailsRequest request, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead row = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, row, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to update this lead");
        }
        if (!canEditLead(actor, row)) {
            throw new AccessDeniedException("Only the current owner can edit this lead");
        }

        if (request.getAlternatePhone() != null) {
            row.setAlternatePhone(normalizeNullable(request.getAlternatePhone()));
        }
        if (request.getAlternateEmail() != null) {
            row.setAlternateEmail(normalizeNullable(request.getAlternateEmail()));
        }
        if (request.getCountryCode() != null) {
            row.setCountryCode(normalizeNullable(request.getCountryCode()));
        }
        if (request.getFollowUpDate() != null) {
            row.setFollowUpDate(request.getFollowUpDate());
        }
        if (request.getOccupation() != null) {
            row.setOccupation(normalizeNullable(request.getOccupation()));
        }
        if (request.getCompanyName() != null) {
            row.setCompanyName(normalizeNullable(request.getCompanyName()));
        }
        if (request.getLeadType() != null) {
            String leadType = normalizeNullable(request.getLeadType());
            if (leadType != null && !leadTypeRepository.existsByTypeNameIgnoreCaseAndDeletedFalse(leadType)) {
                throw new IllegalStateException("Invalid lead type");
            }
            row.setLeadType(leadType);
        }
        if (request.getAttemptedOpenReason() != null) {
            row.setAttemptedOpenReason(normalizeNullable(request.getAttemptedOpenReason()));
        }
        if (request.getAttemptedCallStatus() != null) {
            row.setAttemptedCallStatus(normalizeNullable(request.getAttemptedCallStatus()));
        }
        if (request.getAttemptedCallRemarks() != null) {
            row.setAttemptedCallRemarks(normalizeNullable(request.getAttemptedCallRemarks()));
        }
        if (request.getInterestedFollowUpDate() != null) {
            row.setInterestedFollowUpDate(request.getInterestedFollowUpDate());
        }
        if (request.getInterestedCallRemarks() != null) {
            row.setInterestedCallRemarks(normalizeNullable(request.getInterestedCallRemarks()));
        }
        if (request.getRejectedReason() != null) {
            row.setRejectedReason(normalizeNullable(request.getRejectedReason()));
        }
        if (request.getRejectedReasonSubtype() != null) {
            row.setRejectedReasonSubtype(normalizeNullable(request.getRejectedReasonSubtype()));
        }
        // payment tracking fields
        if (request.getTotalAmount() != null) {
            row.setTotalAmount(request.getTotalAmount());
        }
        if (request.getPaidAmount() != null) {
            row.setPaidAmount(request.getPaidAmount());
        }
        if (request.getRemainingAmount() != null) {
            row.setRemainingAmount(request.getRemainingAmount());
        }
        if (request.getDesignStartAt() != null) {
            row.setDesignStartAt(request.getDesignStartAt());
        }
        if (request.getDesignEndAt() != null) {
            row.setDesignEndAt(request.getDesignEndAt());
        }
        if (request.getPaymentOwnerId() != null) {
            row.setPaymentOwnerId(request.getPaymentOwnerId());
        }
        if (request.getRequirementType() != null) {
            row.setRequirementType(normalizeNullable(request.getRequirementType()));
        }
        if (request.getRequirementFileName() != null) {
            row.setRequirementFileName(normalizeNullable(request.getRequirementFileName()));
        }
        if (request.getRequirementFilePath() != null) {
            row.setRequirementFilePath(normalizeNullable(request.getRequirementFilePath()));
        }
        if (request.getRequirementFileType() != null) {
            row.setRequirementFileType(normalizeNullable(request.getRequirementFileType()));
        }
        if (request.getRequirementFileSize() != null) {
            row.setRequirementFileSize(request.getRequirementFileSize());
        }
        if (request.getRequirementNotes() != null) {
            row.setRequirementNotes(normalizeNullable(request.getRequirementNotes()));
        }

        Lead saved = leadRepository.save(row);
        auditService.log("LEAD_DETAILS_UPDATE", "Updated lead details", actor.getEmail());
        createLeadLog(saved.getId(), "Lead details updated", actor);

        Map<Long, String> cpNameMap = new HashMap<>();
        if (saved.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }
        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));

        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    public void deleteLead(Long id, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead row = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, row, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to delete this lead");
        }
        if (actor.getRole() == Role.EMPLOYEE) {
            throw new AccessDeniedException("You do not have permission to delete this lead");
        }
        row.setDeleted(true);
        leadRepository.save(row);
        auditService.log("LEAD_DELETE", "Deleted lead " + row.getLeadId(), actor.getEmail());
        createLeadLog(row.getId(), "Lead deleted", actor);
    }

    @Transactional(readOnly = true)
    public LeadResponse getCustomerLead(String actorPrincipal) {
        User actor = resolveActor(actorPrincipal);
        if (actor.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("You do not have permission to access customer leads");
        }
        if (!StringUtils.hasText(actor.getEmail())) {
            throw new EntityNotFoundException("Customer email not found");
        }
        String email = actor.getEmail().trim().toLowerCase(Locale.ROOT);
        Lead lead = leadRepository
                .findTopByDeletedFalseAndEmailNormalizedOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));

        Map<Long, String> cpNameMap = new HashMap<>();
        if (lead.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(lead.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }
        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(lead));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(lead));
        return toResponse(lead, cpNameMap, groupNameMap, userNameMap);
    }

    public LeadResponse updateCustomerLeadStatus(LeadUpdateStatusRequest request, String actorPrincipal) {
        User actor = resolveActor(actorPrincipal);
        if (actor.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("You do not have permission to update lead status");
        }
        if (request == null || !StringUtils.hasText(request.getStatus())) {
            throw new IllegalStateException("Status is required");
        }
        String status = request.getStatus().trim();
        if (!leadStatusRepository.existsByStatusNameIgnoreCaseAndDeletedFalse(status)) {
            throw new IllegalStateException("Invalid lead status");
        }
        if (!"payment".equalsIgnoreCase(status) && !"rejected".equalsIgnoreCase(status)) {
            throw new IllegalStateException("Customer can only select Payment or Rejected");
        }
        if ("rejected".equalsIgnoreCase(status) && !StringUtils.hasText(request.getRejectedReason())) {
            throw new IllegalStateException("Rejected reason is required");
        }

        Lead lead = findCustomerLead(actor);
        applyFlowStatusTransition(lead, status, null);
        if ("rejected".equalsIgnoreCase(status)) {
            lead.setRejectedReason(normalizeNullable(request.getRejectedReason()));
            lead.setRejectedReasonSubtype(normalizeNullable(request.getRejectedReasonSubtype()));
        } else {
            lead.setRejectedReason(null);
            lead.setRejectedReasonSubtype(null);
        }
        Lead saved = leadRepository.save(lead);
        auditService.log("LEAD_STATUS_UPDATE", "Customer updated lead status to " + status, actor.getEmail());
        createLeadLog(saved.getId(), "Status changed to " + saved.getStatus(), actor);

        Map<Long, String> cpNameMap = loadChannelPartnerNameMap(List.of(saved));
        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));
        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
    }

    private Lead findCustomerLead(User actor) {
        if (actor == null || !StringUtils.hasText(actor.getEmail())) {
            throw new EntityNotFoundException("Lead not found");
        }
        String email = actor.getEmail().trim().toLowerCase(Locale.ROOT);
        return leadRepository
                .findTopByDeletedFalseAndEmailNormalizedOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
    }

    private User assertLeadAccess(String actorPrincipal) {
        User actor = resolveActor(actorPrincipal);
        if (actor.getRole() != Role.SUPER_ADMIN
                && actor.getRole() != Role.ADMIN
                && actor.getRole() != Role.MANAGER
                && actor.getRole() != Role.EMPLOYEE) {
            throw new AccessDeniedException("You do not have permission to access leads");
        }
        if (actor.getRole() == Role.EMPLOYEE && findLeadVisibleGroupsForActor(actor).isEmpty()) {
            throw new AccessDeniedException("No lead-visible group is assigned to your account");
        }
        return actor;
    }

    private User resolveActor(String actorPrincipal) {
        if (!StringUtils.hasText(actorPrincipal)) {
            throw new AccessDeniedException("Unauthenticated actor");
        }
        if (actorPrincipal.contains("@")) {
            return userRepository.findByEmailAndIsDeletedFalse(actorPrincipal.trim().toLowerCase(Locale.ROOT))
                    .orElseThrow(() -> new EntityNotFoundException("Actor not found"));
        }
        return userRepository.findByUsernameAndIsDeletedFalse(actorPrincipal.trim())
                .orElseThrow(() -> new EntityNotFoundException("Actor not found"));
    }

    private List<UserGroup> findLeadVisibleGroupsForActor(User actor) {
        if (actor.getRole() == Role.SUPER_ADMIN) {
            return userGroupRepository.findAllByOrderByGroupLevelAscNameAsc().stream()
                    .filter(this::hasLeadVisibility)
                    .toList();
        }

        if (actor.getRole() == Role.ADMIN) {
            assertActorHasDepartmentScope(actor);
            return userGroupRepository
                    .findByInstitutionNameIgnoreCaseAndInstitutionCategoryIgnoreCaseAndInstitutionTypeIgnoreCaseAndDepartmentNameIgnoreCaseOrderByGroupLevelAscNameAsc(
                            actor.getInstitutionName(),
                            actor.getInstitutionCategory(),
                            actor.getInstitutionType(),
                            actor.getDepartmentName()
                    ).stream()
                    .filter(this::hasLeadVisibility)
                    .toList();
        }

        if (actor.getRole() == Role.MANAGER) {
            assertActorHasTeamScope(actor);
            return userGroupRepository
                    .findByInstitutionNameIgnoreCaseAndInstitutionCategoryIgnoreCaseAndInstitutionTypeIgnoreCaseAndDepartmentNameIgnoreCaseOrderByGroupLevelAscNameAsc(
                            actor.getInstitutionName(),
                            actor.getInstitutionCategory(),
                            actor.getInstitutionType(),
                            actor.getDepartmentName()
                    ).stream()
                    .filter(this::hasLeadVisibility)
                    .filter(group -> groupIncludesTeam(group, actor.getTeamName()))
                    .toList();
        }

        if (actor.getRole() == Role.EMPLOYEE) {
            Map<Long, UserGroup> byId = new LinkedHashMap<>();
            for (UserGroupMember membership : userGroupMemberRepository.findByUser_IdOrderByIdAsc(actor.getId())) {
                UserGroup group = membership.getGroup();
                if (group != null
                        && group.getId() != null
                        && hasLeadVisibility(group)
                        && memberHasLeadVisibility(membership)) {
                    byId.putIfAbsent(group.getId(), group);
                }
            }
            return byId.values().stream()
                    .sorted(GROUP_ORDER_COMPARATOR)
                    .toList();
        }

        return List.of();
    }

    private Set<Long> resolveVisibleLeadGroupIds(User actor) {
        if (actor.getRole() == Role.SUPER_ADMIN) {
            return Set.of();
        }
        return findLeadVisibleGroupsForActor(actor).stream()
                .map(UserGroup::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private boolean canViewLead(User actor, Lead row, Set<Long> visibleGroupIds) {
        if (actor.getRole() == Role.SUPER_ADMIN) {
            return true;
        }
        if (actor.getRole() == Role.EMPLOYEE) {
            // employees see leads they currently own
            if (row.getOwnerUserId() != null && Objects.equals(row.getOwnerUserId(), actor.getId())) {
                return true;
            }
            // during design/production the payment handler still has read access
            if (("design".equalsIgnoreCase(row.getStatus()) || "production".equalsIgnoreCase(row.getStatus()))
                    && row.getPaymentOwnerId() != null
                    && Objects.equals(row.getPaymentOwnerId(), actor.getId())) {
                return true;
            }
            return false;
        }
        if (row.getAssignedGroupId() != null) {
            return visibleGroupIds.contains(row.getAssignedGroupId());
        }
        if (row.getOwnerUserId() != null) {
            return Objects.equals(row.getOwnerUserId(), actor.getId());
        }
        return textEquals(row.getOwner(), actor.getUsername());
    }

    private boolean canEditLead(User actor, Lead row) {
        if (actor.getRole() == Role.SUPER_ADMIN
                || actor.getRole() == Role.ADMIN
                || actor.getRole() == Role.MANAGER) {
            return true;
        }
        if (actor.getRole() == Role.EMPLOYEE) {
            return row.getOwnerUserId() != null && row.getOwnerUserId().equals(actor.getId());
        }
        return false;
    }

    private boolean canEmployeeAllocateTo(User actor, User target, Lead row) {
        if (actor == null || target == null || row == null) {
            return false;
        }
        if (target.getRole() == Role.EMPLOYEE) {
            if (row.getAssignedGroupId() == null) {
                return false;
            }
            return userGroupMemberRepository
                    .findByGroup_IdAndUser_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalse(
                            row.getAssignedGroupId(),
                            target.getId(),
                            Role.EMPLOYEE,
                            ActivationStatus.ACTIVE
                    ).stream()
                    .anyMatch(this::memberHasLeadVisibility);
        }
        if (target.getRole() == Role.MANAGER) {
            return isSameTeamScope(actor, target);
        }
        if (target.getRole() == Role.ADMIN) { 	
            return isSameDepartmentScope(actor, target);
        }
        return false;
    }

    private List<User> loadGroupEmployees(Lead row) {
        if (row == null || row.getAssignedGroupId() == null) {
            return List.of();
        }
        return userGroupRepository.findById(row.getAssignedGroupId())
                .map(userGroupMemberRepository::findByGroupOrderByUserUsernameAsc)
                .orElse(List.of())
                .stream()
                .filter(this::memberHasLeadVisibility)
                .map(UserGroupMember::getUser)
                .filter(Objects::nonNull)
                .filter(User::isActive)
                .filter(user -> user.getActivationStatus() == ActivationStatus.ACTIVE)
                .filter(user -> user.getRole() == Role.EMPLOYEE)
                .toList();
    }

    private boolean isAssociatedManager(User manager, List<User> groupEmployees) {
        if (manager == null || groupEmployees == null || manager.getRole() != Role.MANAGER) {
            return false;
        }
        return groupEmployees.stream().anyMatch(emp -> isSameTeamScope(emp, manager));
    }

    private boolean isAssociatedAdmin(User admin, List<User> groupEmployees) {
        if (admin == null || groupEmployees == null || admin.getRole() != Role.ADMIN) {
            return false;
        }
        return groupEmployees.stream().anyMatch(emp -> isSameDepartmentScope(emp, admin));
    }

    private Long resolveFlowGroupForStatus(String status) {
        try {
            List<Map<String, Object>> rules = leadFlowService.getFlow().getRules();
            FlowRule rule = findFlowRule(rules, status);
            return rule == null ? null : rule.handledByGroupId;
        } catch (Exception e) {
            return null;
        }
    }

    private Long resolveFlowNextGroupId(String currentStatus, String nextStatus) {
        try {
            List<Map<String, Object>> rules = leadFlowService.getFlow().getRules();
            FlowRule currentRule = findFlowRule(rules, currentStatus);
            FlowRule targetRule = findFlowRule(rules, nextStatus);
            Long nextGroupId = currentRule != null ? currentRule.nextGroupIdFor(nextStatus) : null;
            // Check target rule before falling back to current rule
            if (nextGroupId == null && targetRule != null) {
                nextGroupId = targetRule.handledByGroupId;
            }
            if (nextGroupId == null && currentRule != null && currentRule.handledByGroupId != null) {
                nextGroupId = currentRule.handledByGroupId;
            }
            return nextGroupId;
        } catch (Exception e) {
            return null;
        }
    }

    private void applyFlowStatusTransition(Lead row, String nextStatus, Long forcedNextGroupId) {
        if (row == null || !StringUtils.hasText(nextStatus)) {
            return;
        }
        List<Map<String, Object>> rules = null;
        try {
            rules = leadFlowService.getFlow().getRules();
        } catch (Exception ignored) {
            rules = null;
        }
        if (rules == null || rules.isEmpty()) {
            row.setStatus(nextStatus);
            return;
        }

        String currentStatus = StringUtils.hasText(row.getStatus()) ? row.getStatus().trim() : "";
        FlowRule currentRule = findFlowRule(rules, currentStatus);
        FlowRule targetRule = findFlowRule(rules, nextStatus);

        if (currentRule != null && !currentRule.allows(nextStatus)) {
            throw new IllegalStateException("This status transition is not allowed by flow");
        }

        // Determine current group ID
        Long currentGroupId = row.getAssignedGroupId();
        if (currentGroupId == null && currentRule != null) {
            currentGroupId = currentRule.handledByGroupId;
        }

        // Resolve next group ID from flow rules
        Long nextGroupId = forcedNextGroupId;
        if (nextGroupId == null) {
            nextGroupId = currentRule != null ? currentRule.nextGroupIdFor(nextStatus) : null;
            if (nextGroupId == null && targetRule != null) {
                nextGroupId = targetRule.handledByGroupId;
            }
            if (nextGroupId == null && currentRule != null && currentRule.handledByGroupId != null) {
                nextGroupId = currentRule.handledByGroupId;
            }
        }

        // Determine if the group is changing
        boolean groupChanging = currentGroupId == null || nextGroupId == null || !currentGroupId.equals(nextGroupId);

        // When leaving a tracked status, save the current owner for later restoration
        if (shouldTrackOwnerForStatus(currentStatus) && row.getOwnerUserId() != null) {
            setStatusOwner(row, currentStatus, row.getOwnerUserId());
        }

        row.setStatus(nextStatus);

        if (nextGroupId != null) {
            row.setAssignedGroupId(nextGroupId);
        }

        // Only reassign/restore owner if the group is changing
        // If staying in the same group, keep the current owner
        if (groupChanging && shouldTrackOwnerForStatus(nextStatus)) {
            Long ownerGroupId = nextGroupId != null ? nextGroupId : row.getAssignedGroupId();
            if (ownerGroupId != null) {
                try {
                    applySavedOrRoundRobinOwner(row, nextStatus, ownerGroupId);
                } catch (IllegalStateException ise) {
                    throw new IllegalStateException("Cannot move lead to " + nextStatus + ": " + ise.getMessage());
                }
            }
        }
    }

    /**
     * Determine if we should save/restore the owner for a given status.
     * Currently tracked: payment, design, production
     */
    private boolean shouldTrackOwnerForStatus(String status) {
        if (!StringUtils.hasText(status)) return false;
        String lower = status.trim().toLowerCase();
        return lower.equals("payment") || lower.equals("design") || lower.equals("production");
    }

    /**
     * Set the saved owner for a status (for future restoration).
     */
    private void setStatusOwner(Lead lead, String status, Long userId) {
        if (!StringUtils.hasText(status)) return;
        String lower = status.trim().toLowerCase();
        switch (lower) {
            case "payment":
                lead.setPaymentOwnerId(userId);
                break;
            case "design":
                lead.setDesignOwnerId(userId);
                break;
            case "production":
                lead.setProductionOwnerId(userId);
                break;
        }
    }

    /**
     * Get the saved owner for a status (for restoration).
     */
    private Long getStatusOwner(Lead lead, String status) {
        if (!StringUtils.hasText(status)) return null;
        String lower = status.trim().toLowerCase();
        switch (lower) {
            case "payment":
                return lead.getPaymentOwnerId();
            case "design":
                return lead.getDesignOwnerId();
            case "production":
                return lead.getProductionOwnerId();
            default:
                return null;
        }
    }

    /**
     * Restore saved owner if available and active, otherwise do round-robin and save the new owner.
     */
    private void applySavedOrRoundRobinOwner(Lead lead, String nextStatus, Long ownerGroupId) {
        Long savedOwnerId = getStatusOwner(lead, nextStatus);

        if (savedOwnerId != null) {
            // Try to restore the saved owner if still active
            userRepository.findById(savedOwnerId).ifPresentOrElse(owner -> {
                if (owner.isActive() && owner.getActivationStatus() == ActivationStatus.ACTIVE) {
                    // Saved owner is still active, use them
                    lead.setOwnerUserId(owner.getId());
                    lead.setOwner(resolveOwnerName(owner));
                } else {
                    // Saved owner is inactive, do round-robin instead
                    User newOwner = resolveRoundRobinOwnerForGroup(ownerGroupId);
                    lead.setOwnerUserId(newOwner.getId());
                    lead.setOwner(resolveOwnerName(newOwner));
                    // Update the saved owner for next time
                    setStatusOwner(lead, nextStatus, newOwner.getId());
                }
            }, () -> {
                // Saved owner not found, do round-robin instead
                User newOwner = resolveRoundRobinOwnerForGroup(ownerGroupId);
                lead.setOwnerUserId(newOwner.getId());
                lead.setOwner(resolveOwnerName(newOwner));
                // Update the saved owner for next time
                setStatusOwner(lead, nextStatus, newOwner.getId());
            });
        } else {
            // No saved owner, do round-robin and save it
            User owner = resolveRoundRobinOwnerForGroup(ownerGroupId);
            lead.setOwnerUserId(owner.getId());
            lead.setOwner(resolveOwnerName(owner));
            // Save this owner for future transitions to this status
            setStatusOwner(lead, nextStatus, owner.getId());
        }
    }

    private User resolveRoundRobinOwnerForGroup(Long groupId) {
        if (groupId == null) {
            throw new IllegalStateException("Payment group is required for round robin assignment");
        }
        List<UserGroupMember> eligibleMembers = userGroupMemberRepository
                .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                        groupId,
                        Role.EMPLOYEE,
                        ActivationStatus.ACTIVE
                ).stream()
                .filter(this::memberHasLeadVisibility)
                .toList();

        if (eligibleMembers.isEmpty()) {
            throw new IllegalStateException("Selected group has no eligible active employee available for lead assignment");
        }

        return resolveRoundRobinOwner(groupId, eligibleMembers);
    }

    private FlowRule findFlowRule(List<Map<String, Object>> rules, String status) {
        if (!StringUtils.hasText(status) || rules == null) {
            return null;
        }
        String key = status.trim().toLowerCase(Locale.ROOT);
        for (Map<String, Object> raw : rules) {
            if (raw == null) continue;
            Object statusVal = raw.get("status");
            if (statusVal == null) continue;
            if (statusVal.toString().trim().toLowerCase(Locale.ROOT).equals(key)) {
                return FlowRule.from(raw);
            }
        }
        return null;
    }

    private void ensureCustomerAccount(Lead lead, User actor) {
        if (lead == null || !StringUtils.hasText(lead.getEmail())) {
            return;
        }
        String email = lead.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByEmailAndIsDeletedFalse(email).isPresent()) {
            return;
        }
        String fullName = lead.getName() == null ? "" : lead.getName().trim();
        String[] nameParts = fullName.isBlank() ? new String[0] : fullName.split("\\s+", 2);
        String baseUsername = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        String username = normalizeCustomerUsername(baseUsername);

        User customer = new User();
        customer.setUsername(username);
        customer.setEmail(email);
        if (nameParts.length > 0) {
            customer.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                customer.setLastName(nameParts[1]);
            }
        }
        customer.setPasswordHash(passwordEncoder.encode(DEFAULT_CUSTOMER_PASSWORD));
        customer.setRole(Role.CUSTOMER);
        customer.setActivationStatus(ActivationStatus.ACTIVE);
        customer.setActive(true);
        customer.setForcePasswordChange(true);
        customer.setCreatedBy(actor != null ? actor.getEmail() : null);
        userRepository.save(customer);
        auditService.log("CUSTOMER_CREATED", "Created customer account for lead", email);
    }

    private String normalizeCustomerUsername(String base) {
        String safe = StringUtils.hasText(base) ? base.trim() : "customer";
        safe = safe.replaceAll("[^a-zA-Z0-9._-]", "");
        if (!StringUtils.hasText(safe)) {
            safe = "customer";
        }
        String candidate = safe;
        int counter = 1;
        while (userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse(candidate)) {
            candidate = safe + counter;
            counter++;
        }
        return candidate;
    }

    /**
     * After updating the flow rules we may need to reassign leads that are
     * already in a status whose handler group has changed.  This method is
     * called by LeadFlowService.updateFlow().
     *
     * For each rule with a non-null handledByGroupId we load all non-deleted
     * leads matching that status, set their assignedGroupId to the new value,
     * attempt a round-robin owner assignment, clear any stale payment-owner
     * marker, and save the lead.  If there are no eligible employees in the
     * group we still clear the owner so the record becomes un-owned; the group
     * itself can later be allocated manually.
     */
    @Transactional
    public void reassignLeadsForFlow(List<Map<String, Object>> rules) {
        if (rules == null) return;
        for (Map<String, Object> raw : rules) {
            if (raw == null) continue;
            Object statusVal = raw.get("status");
            if (statusVal == null) continue;
            String status = statusVal.toString().trim();
            if (!StringUtils.hasText(status)) continue;
            Long groupId = toLong(raw.get("handledByGroupId"));
            if (groupId == null) continue;

            List<Lead> leads = leadRepository.findByDeletedFalseOrderByCreatedAtDesc()
                    .stream()
                    .filter(l -> status.equalsIgnoreCase(l.getStatus()))
                    .toList();
            for (Lead lead : leads) {
                lead.setAssignedGroupId(groupId);
                try {
                    User owner = resolveRoundRobinOwnerForGroup(groupId);
                    lead.setOwnerUserId(owner.getId());
                    lead.setOwner(resolveOwnerName(owner));
                } catch (IllegalStateException ise) {
                    // no active employee available - clear owner so it can be
                    // manually picked later
                    lead.setOwnerUserId(null);
                    lead.setOwner(null);
                }
                // once we've deliberately moved the lead to a new group the
                // previous payment owner is no longer relevant
                lead.setPaymentOwnerId(null);
                leadRepository.save(lead);
                try {
                    auditService.log("LEAD_FLOW_REASSIGN",
                            "Reassigned lead " + lead.getLeadId() + " to group " + groupId,
                            null);
                } catch (Exception ignore) {
                }
            }
        }
    }

    private static final class FlowRule {
        private final String status;
        private final Long handledByGroupId;
        private final Map<String, Long> nextMap;

        private FlowRule(String status, Long handledByGroupId, Map<String, Long> nextMap) {
            this.status = status;
            this.handledByGroupId = handledByGroupId;
            this.nextMap = nextMap == null ? Map.of() : nextMap;
        }

        static FlowRule from(Map<String, Object> raw) {
            String status = raw.get("status") == null ? "" : raw.get("status").toString();
            Long handledBy = toLong(raw.get("handledByGroupId"));

            Map<String, Long> next = new HashMap<>();
            Object nextObj = raw.get("next");
            if (nextObj instanceof Map<?, ?> nextMapRaw) {
                for (Map.Entry<?, ?> entry : nextMapRaw.entrySet()) {
                    if (entry.getKey() == null) continue;
                    String key = entry.getKey().toString();
                    next.put(key, toLong(entry.getValue()));
                }
            }
            Object allowedList = raw.get("allowedNext");
            if (allowedList instanceof List<?> allowed) {
                for (Object item : allowed) {
                    if (item == null) continue;
                    String key = item.toString();
                    next.putIfAbsent(key, null);
                }
            }
            if (next.isEmpty()) {
                Object nextStatuses = raw.get("nextStatuses");
                if (nextStatuses instanceof List<?> list) {
                    for (Object item : list) {
                        if (item == null) continue;
                        next.putIfAbsent(item.toString(), null);
                    }
                }
            }

            return new FlowRule(status, handledBy, next);
        }

        boolean allows(String nextStatus) {
            if (!StringUtils.hasText(nextStatus)) {
                return false;
            }
            for (String key : nextMap.keySet()) {
                if (key != null && key.trim().equalsIgnoreCase(nextStatus)) {
                    return true;
                }
            }
            return false;
        }

        Long nextGroupIdFor(String nextStatus) {
            if (!StringUtils.hasText(nextStatus)) {
                return null;
            }
            for (Map.Entry<String, Long> entry : nextMap.entrySet()) {
                if (entry.getKey() != null && entry.getKey().trim().equalsIgnoreCase(nextStatus)) {
                    return entry.getValue();
                }
            }
            return null;
        }
    }

    private static Long toLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number number) {
            return number.longValue();
        }
        try {
            String text = value.toString().trim();
            if (!StringUtils.hasText(text)) return null;
            return Long.parseLong(text);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isSameTeamScope(User actor, User target) {
        if (actor == null || target == null) {
            return false;
        }
        if (!hasTeamScope(actor) || !hasTeamScope(target)) {
            return false;
        }
        return textEquals(actor.getInstitutionName(), target.getInstitutionName())
                && textEquals(actor.getInstitutionCategory(), target.getInstitutionCategory())
                && textEquals(actor.getInstitutionType(), target.getInstitutionType())
                && textEquals(actor.getDepartmentName(), target.getDepartmentName())
                && textEquals(actor.getTeamName(), target.getTeamName());
    }

    private boolean isSameDepartmentScope(User actor, User target) {
        if (actor == null || target == null) {
            return false;
        }
        if (!hasDepartmentScope(actor) || !hasDepartmentScope(target)) {
            return false;
        }
        return textEquals(actor.getInstitutionName(), target.getInstitutionName())
                && textEquals(actor.getInstitutionCategory(), target.getInstitutionCategory())
                && textEquals(actor.getInstitutionType(), target.getInstitutionType())
                && textEquals(actor.getDepartmentName(), target.getDepartmentName());
    }



    private UserGroup resolveLeadGroupForCreate(User actor, Long requestedGroupId) {
        List<UserGroup> availableGroups = findLeadVisibleGroupsForActor(actor);

        if (actor.getRole() == Role.EMPLOYEE) {
            if (availableGroups.isEmpty()) {
                throw new AccessDeniedException("No lead-visible group is assigned to your account");
            }
            if (requestedGroupId == null) {
                return availableGroups.get(0);
            }
            return availableGroups.stream()
                    .filter(group -> Objects.equals(group.getId(), requestedGroupId))
                    .findFirst()
                    .orElseThrow(() -> new AccessDeniedException("You do not have permission to use the selected lead group"));
        }

        if (requestedGroupId == null) {
            throw new IllegalStateException("Lead Group is required");
        }

        return availableGroups.stream()
                .filter(group -> Objects.equals(group.getId(), requestedGroupId))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("You do not have permission to use the selected lead group"));
    }

    private User resolveLeadOwnerForCreate(User actor, UserGroup selectedGroup) {
        if (actor.getRole() == Role.EMPLOYEE) {
            return actor;
        }

        List<UserGroupMember> eligibleMembers = userGroupMemberRepository
                .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                        selectedGroup.getId(),
                        Role.EMPLOYEE,
                        ActivationStatus.ACTIVE
                ).stream()
                .filter(this::memberHasLeadVisibility)
                .toList();

        if (eligibleMembers.isEmpty()) {
            throw new IllegalStateException("Selected group has no eligible active employee available for lead assignment");
        }

        return resolveRoundRobinOwner(selectedGroup.getId(), eligibleMembers);
    }

    private User resolveRoundRobinOwner(Long groupId, List<UserGroupMember> eligibleMembers) {
        List<User> candidates = eligibleMembers.stream()
                .map(UserGroupMember::getUser)
                .filter(Objects::nonNull)
                .toList();

        if (candidates.isEmpty()) {
            throw new IllegalStateException("Selected group has no eligible active employee available for lead assignment");
        }

        List<Long> candidateIds = candidates.stream().map(User::getId).toList();
        Set<Long> candidateIdSet = new HashSet<>(candidateIds);

        Long lastOwnerUserId = leadRepository.findByDeletedFalseAndAssignedGroupIdOrderByCreatedAtDesc(groupId)
                .stream()
                .map(Lead::getOwnerUserId)
                .filter(Objects::nonNull)
                .filter(candidateIdSet::contains)
                .findFirst()
                .orElse(null);

        if (lastOwnerUserId == null) {
            return candidates.get(0);
        }

        int currentIndex = -1;
        for (int idx = 0; idx < candidates.size(); idx++) {
            if (Objects.equals(candidates.get(idx).getId(), lastOwnerUserId)) {
                currentIndex = idx;
                break;
            }
        }

        if (currentIndex < 0) {
            return candidates.get(0);
        }

        int nextIndex = (currentIndex + 1) % candidates.size();
        return candidates.get(nextIndex);
    }

    private void assertActorHasDepartmentScope(User actor) {
        if (!StringUtils.hasText(actor.getInstitutionName())
                || !StringUtils.hasText(actor.getInstitutionCategory())
                || !StringUtils.hasText(actor.getInstitutionType())
                || !StringUtils.hasText(actor.getDepartmentName())) {
            throw new AccessDeniedException("Your account is missing department scope configuration");
        }
    }

    private void assertActorHasTeamScope(User actor) {
        assertActorHasDepartmentScope(actor);
        if (!StringUtils.hasText(actor.getTeamName())) {
            throw new AccessDeniedException("Your account is missing team scope configuration");
        }
    }

    private boolean hasLeadVisibility(UserGroup group) {
        String pageKeysCsv = group == null ? null : group.getPageKeysCsv();
        if (!StringUtils.hasText(pageKeysCsv)) {
            return true;
        }
        return parseCsv(pageKeysCsv).stream()
                .anyMatch(value -> LEADS_PAGE_KEY.equalsIgnoreCase(value));
    }

    private boolean memberHasLeadVisibility(UserGroupMember membership) {
        String pageKeysCsv = membership == null ? null : membership.getPageKeysCsv();
        if (!StringUtils.hasText(pageKeysCsv)) {
            return true;
        }
        return parseCsv(pageKeysCsv).stream()
                .anyMatch(value -> LEADS_PAGE_KEY.equalsIgnoreCase(value));
    }

    private boolean groupIncludesTeam(UserGroup group, String teamName) {
        if (!StringUtils.hasText(teamName)) {
            return false;
        }
        return parseCsv(group == null ? null : group.getTeamNamesCsv()).stream()
                .anyMatch(value -> value.equalsIgnoreCase(teamName.trim()));
    }

    private List<String> parseCsv(String csv) {
        if (!StringUtils.hasText(csv)) {
            return List.of();
        }
        return java.util.Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private LeadResponse toResponse(Lead row,
                                    Map<Long, String> cpNameMap,
                                    Map<Long, String> groupNameMap,
                                    Map<Long, String> userNameMap) {
        LeadResponse res = new LeadResponse();
        res.setId(row.getId());
        res.setLeadId(row.getLeadId());
        res.setEuid(row.getEuid());
        res.setName(row.getName());
        res.setEmail(row.getEmail());
        res.setMobile(row.getMobile());
        res.setCountryCode(row.getCountryCode());
        res.setAlternatePhone(row.getAlternatePhone());
        res.setAlternateEmail(row.getAlternateEmail());
        res.setPrimarySource(row.getPrimarySource());
        res.setSecondarySource(row.getSecondarySource());
        res.setTertiarySource(row.getTertiarySource());
        res.setProjectName(row.getProjectName());
        res.setOccupation(row.getOccupation());
        res.setCompanyName(row.getCompanyName());
        res.setLeadType(row.getLeadType());
        res.setChannelPartnerId(row.getChannelPartnerId());
        res.setChannelPartnerName(cpNameMap.get(row.getChannelPartnerId()));
        res.setStatus(row.getStatus());
        res.setSvStatus(row.getSvStatus());
        res.setLeadGroupId(row.getAssignedGroupId());
        res.setLeadGroupName(groupNameMap.get(row.getAssignedGroupId()));
        res.setAllocatorUserId(row.getAllocatorUserId());
        res.setAllocator(userNameMap.get(row.getAllocatorUserId()));
        res.setOwnerUserId(row.getOwnerUserId());

        String ownerName = row.getOwner();
        if (!StringUtils.hasText(ownerName) && row.getOwnerUserId() != null) {
            ownerName = userNameMap.get(row.getOwnerUserId());
        }
        res.setOwner(ownerName);

        res.setFollowUpDate(row.getFollowUpDate());
        res.setAttemptedOpenReason(row.getAttemptedOpenReason());
        res.setAttemptedCallStatus(row.getAttemptedCallStatus());
        res.setAttemptedCallRemarks(row.getAttemptedCallRemarks());
        res.setInterestedFollowUpDate(row.getInterestedFollowUpDate());
        res.setInterestedCallRemarks(row.getInterestedCallRemarks());
        res.setRejectedReason(row.getRejectedReason());
        res.setRejectedReasonSubtype(row.getRejectedReasonSubtype());
        // payment tracking
        res.setTotalAmount(row.getTotalAmount());
        res.setPaidAmount(row.getPaidAmount());
        res.setRemainingAmount(row.getRemainingAmount());
        res.setDesignStartAt(row.getDesignStartAt());
        res.setDesignEndAt(row.getDesignEndAt());
        // if the lead is currently in design phase but a payment employee still
        // owns it this field carries the original owner so the frontend can
        // restore them when the status flips back to payment.
        res.setPaymentOwnerId(row.getPaymentOwnerId());
        res.setProductionOwnerId(row.getProductionOwnerId());
        // requirement values
        res.setRequirementType(row.getRequirementType());
        res.setRequirementFileName(row.getRequirementFileName());
        res.setRequirementFilePath(row.getRequirementFilePath());
        res.setRequirementFileType(row.getRequirementFileType());
        res.setRequirementFileSize(row.getRequirementFileSize());
        res.setRequirementNotes(row.getRequirementNotes());
        res.setCreatedAt(row.getCreatedAt());
        return res;
    }

    @Transactional(readOnly = true)
    public List<LeadLogResponse> listLeadLogs(Long leadId, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead lead = leadRepository.findByIdAndDeletedFalse(leadId)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, lead, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to access this lead");
        }
        return leadLogRepository.findByLeadIdOrderByCreatedAtDesc(leadId).stream()
                .map(this::toLeadLogResponse)
                .toList();
    }

    private void createLeadLog(Long leadId, String action, User actor) {
        if (leadId == null || !StringUtils.hasText(action) || actor == null) {
            return;
        }
        LeadLog log = new LeadLog();
        log.setLeadId(leadId);
        log.setAction(action.trim());
        String actorName = StringUtils.hasText(actor.getUsername())
                ? actor.getUsername()
                : actor.getEmail();
        log.setActor(actorName);
        leadLogRepository.save(log);
    }

    private LeadLogResponse toLeadLogResponse(LeadLog log) {
        LeadLogResponse res = new LeadLogResponse();
        res.setId(log.getId());
        res.setAction(log.getAction());
        res.setActor(log.getActor());
        res.setCreatedAt(log.getCreatedAt());
        return res;
    }

    private String resolveOwnerName(User user) {
        if (user == null) {
            return "Unassigned";
        }
        if (StringUtils.hasText(user.getUsername())) {
            return user.getUsername().trim();
        }
        if (StringUtils.hasText(user.getEmail())) {
            return user.getEmail().trim();
        }
        String firstName = StringUtils.hasText(user.getFirstName()) ? user.getFirstName().trim() : "";
        String lastName = StringUtils.hasText(user.getLastName()) ? user.getLastName().trim() : "";
        String fullName = (firstName + " " + lastName).trim();
        if (StringUtils.hasText(fullName)) {
            return fullName;
        }
        return "User-" + user.getId();
    }

    private Map<Long, String> loadChannelPartnerNameMap(List<Lead> leads) {
        Map<Long, String> out = new HashMap<>();
        List<Long> ids = leads.stream()
                .map(Lead::getChannelPartnerId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (ids.isEmpty()) {
            return out;
        }

        channelPartnerRepository.findAllById(ids).stream()
                .filter(row -> !row.isDeleted())
                .forEach(row -> {
                    String name = StringUtils.hasText(row.getCompanyName()) ? row.getCompanyName() : row.getPartnerName();
                    out.put(row.getId(), name);
                });
        return out;
    }

    private Map<Long, String> loadGroupNameMap(List<Lead> leads) {
        Map<Long, String> out = new HashMap<>();
        List<Long> ids = leads.stream()
                .map(Lead::getAssignedGroupId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (ids.isEmpty()) {
            return out;
        }
        userGroupRepository.findAllById(ids)
                .forEach(group -> out.put(group.getId(), group.getName()));
        return out;
    }

    private Map<Long, String> loadUserNameMap(List<Lead> leads) {
        Map<Long, String> out = new HashMap<>();
        Set<Long> ids = new HashSet<>();
        for (Lead lead : leads) {
            if (lead.getAllocatorUserId() != null) {
                ids.add(lead.getAllocatorUserId());
            }
            if (lead.getOwnerUserId() != null) {
                ids.add(lead.getOwnerUserId());
            }
        }
        if (ids.isEmpty()) {
            return out;
        }

        userRepository.findAllById(ids).forEach(user -> {
            if (!user.isDeleted()) {
                out.put(user.getId(), user.getUsername());
            }
        });
        return out;
    }

    private boolean canAssignAllocator(User actor, User candidate) {
        boolean self = actor.getId().equals(candidate.getId());
        boolean strictlyBelow = RolePermissionUtil.isStrictlyHigher(actor.getRole(), candidate.getRole());
        if (!self && !strictlyBelow) {
            return false;
        }
        return canManageWithinOrgScope(actor, candidate);
    }

    private boolean canManageWithinOrgScope(User actor, User target) {
        if (actor.getId().equals(target.getId())) {
            return true;
        }
        if (actor.getRole() == Role.SUPER_ADMIN) {
            return true;
        }
        if (actor.getRole() == Role.ADMIN) {
            if (!hasDepartmentScope(target)) {
                return true;
            }
            return textEquals(actor.getInstitutionName(), target.getInstitutionName())
                    && textEquals(actor.getInstitutionCategory(), target.getInstitutionCategory())
                    && textEquals(actor.getInstitutionType(), target.getInstitutionType())
                    && textEquals(actor.getDepartmentName(), target.getDepartmentName());
        }
        if (actor.getRole() == Role.MANAGER) {
            if (!hasTeamScope(target)) {
                return true;
            }
            return textEquals(actor.getInstitutionName(), target.getInstitutionName())
                    && textEquals(actor.getInstitutionCategory(), target.getInstitutionCategory())
                    && textEquals(actor.getInstitutionType(), target.getInstitutionType())
                    && textEquals(actor.getDepartmentName(), target.getDepartmentName())
                    && textEquals(actor.getTeamName(), target.getTeamName());
        }
        return false;
    }

    private boolean textEquals(String a, String b) {
        return normalizeNullable(a) != null && normalizeNullable(a).equalsIgnoreCase(StringUtils.hasText(b) ? b.trim() : "");
    }

    private boolean hasDepartmentScope(User user) {
        return StringUtils.hasText(user.getInstitutionName())
                && StringUtils.hasText(user.getInstitutionCategory())
                && StringUtils.hasText(user.getInstitutionType())
                && StringUtils.hasText(user.getDepartmentName());
    }

    private boolean hasTeamScope(User user) {
        return hasDepartmentScope(user) && StringUtils.hasText(user.getTeamName());
    }

    private LeadAllocatorOptionResponse toAllocatorOptionResponse(User user) {
        LeadAllocatorOptionResponse res = new LeadAllocatorOptionResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setRole(user.getRole() == null ? null : user.getRole().name());
        return res;
    }

    private LeadAssignableGroupResponse toAssignableGroupResponse(UserGroup group) {
        LeadAssignableGroupResponse response = new LeadAssignableGroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        return response;
    }

    private boolean containsIgnoreCase(String value, String query) {
        if (!StringUtils.hasText(query)) return true;
        return StringUtils.hasText(value) && value.toLowerCase(Locale.ROOT).contains(query.trim().toLowerCase(Locale.ROOT));
    }

    private boolean equalsIgnoreCase(String value, String expected) {
        if (!StringUtils.hasText(expected)) return true;
        return StringUtils.hasText(value) && value.equalsIgnoreCase(expected.trim());
    }

    private boolean matchQuickDate(LocalDateTime createdAt, String quickDate) {
        if (!StringUtils.hasText(quickDate)) return true;
        if (createdAt == null) return false;
        LocalDate today = LocalDate.now();
        LocalDate date = createdAt.toLocalDate();
        String key = quickDate.trim().toLowerCase(Locale.ROOT);
        if ("today".equals(key)) {
            return date.equals(today);
        }
        if ("weekly".equals(key)) {
            return !date.isBefore(today.minusDays(7));
        }
        if ("monthly".equals(key)) {
            return !date.isBefore(today.minusDays(30));
        }
        return true;
    }

    private String normalizeNullable(String value) {
        if (!StringUtils.hasText(value)) return null;
        return value.trim();
    }

    private String normalizeEmail(String email) {
        if (!StringUtils.hasText(email)) return null;
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeMobile(String mobile) {
        if (!StringUtils.hasText(mobile)) return null;
        return mobile.replaceAll("[^0-9]", "");
    }

    private List<String> distinctSorted(List<String> values) {
        return values.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .distinct()
                .sorted(Comparator.comparing(String::toLowerCase))
                .toList();
    }
}
