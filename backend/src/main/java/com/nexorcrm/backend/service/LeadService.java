
package com.nexorcrm.backend.service;

import com.nexorcrm.backend.dto.LeadAllocatorOptionResponse;
import com.nexorcrm.backend.dto.LeadAssignableGroupResponse;
import com.nexorcrm.backend.dto.LeadCreateRequest;
import com.nexorcrm.backend.dto.LeadFiltersResponse;
import com.nexorcrm.backend.dto.LeadResponse;
import com.nexorcrm.backend.dto.LeadUpdateAllocatorRequest;
import com.nexorcrm.backend.dto.LeadUpdateStatusRequest;
import com.nexorcrm.backend.entity.ActivationStatus;
import com.nexorcrm.backend.entity.ChannelPartner;
import com.nexorcrm.backend.entity.Lead;
import com.nexorcrm.backend.entity.Role;
import com.nexorcrm.backend.entity.User;
import com.nexorcrm.backend.entity.UserGroup;
import com.nexorcrm.backend.entity.UserGroupMember;
import com.nexorcrm.backend.repo.ChannelPartnerRepository;
import com.nexorcrm.backend.repo.LeadRepository;
import com.nexorcrm.backend.repo.LeadStatusRepository;
import com.nexorcrm.backend.repo.UserGroupMemberRepository;
import com.nexorcrm.backend.repo.UserGroupRepository;
import com.nexorcrm.backend.repo.UserRepository;
import com.nexorcrm.backend.security.RolePermissionUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    private final ChannelPartnerRepository channelPartnerRepository;
    private final LeadStatusRepository leadStatusRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserGroupMemberRepository userGroupMemberRepository;
    private final AuditService auditService;

    public LeadService(LeadRepository leadRepository,
                       ChannelPartnerRepository channelPartnerRepository,
                       LeadStatusRepository leadStatusRepository,
                       UserRepository userRepository,
                       UserGroupRepository userGroupRepository,
                       UserGroupMemberRepository userGroupMemberRepository,
                       AuditService auditService) {
        this.leadRepository = leadRepository;
        this.channelPartnerRepository = channelPartnerRepository;
        this.leadStatusRepository = leadStatusRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.userGroupMemberRepository = userGroupMemberRepository;
        this.auditService = auditService;
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
        List<Lead> rows = leadRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
                .filter(row -> canViewLead(actor, row, visibleGroupIds))
                .filter(row -> containsIgnoreCase(row.getName(), search)
                        || containsIgnoreCase(row.getMobile(), search)
                        || containsIgnoreCase(row.getEmail(), search))
                .filter(row -> equalsIgnoreCase(row.getProjectName(), project))
                .filter(row -> equalsIgnoreCase(row.getPrimarySource(), primary))
                .filter(row -> equalsIgnoreCase(row.getStatus(), status))
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
        return findLeadVisibleGroupsForActor(actor).stream()
                .map(this::toAssignableGroupResponse)
                .toList();
    }

    public LeadResponse create(LeadCreateRequest request, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        UserGroup selectedGroup = resolveLeadGroupForCreate(actor, request.getLeadGroupId());
        User ownerUser = resolveLeadOwnerForCreate(actor, selectedGroup);

        String projectName = normalizeNullable(request.getProjectName());
        String email = normalizeNullable(request.getEmail());
        String emailNormalized = normalizeEmail(email);
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
        row.setName(request.getName().trim());
        row.setEmail(email);
        row.setEmailNormalized(emailNormalized);
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

        String status = request.getStatus().trim();
        if (!leadStatusRepository.existsByStatusNameIgnoreCaseAndDeletedFalse(status)) {
            throw new IllegalStateException("Invalid lead status");
        }

        row.setStatus(status);
        Lead saved = leadRepository.save(row);
        auditService.log("LEAD_STATUS_UPDATE", "Updated lead status", actor.getEmail());

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
    public List<LeadAllocatorOptionResponse> listAssignableAllocators(Long leadId, String actorPrincipal) {
        User actor = assertLeadAccess(actorPrincipal);
        Set<Long> visibleGroupIds = resolveVisibleLeadGroupIds(actor);
        Lead lead = leadRepository.findByIdAndDeletedFalse(leadId)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (!canViewLead(actor, lead, visibleGroupIds)) {
            throw new AccessDeniedException("You do not have permission to access this lead");
        }

        List<User> candidates = userRepository.findByRoleInAndActivationStatusAndIsDeletedFalseOrderByUsernameAsc(
                RolePermissionUtil.getVisibleRoles(actor.getRole()),
                ActivationStatus.ACTIVE
        );

        boolean groupedLead = lead.getAssignedGroupId() != null;
        Set<Long> groupedEligibleOwnerIds = groupedLead
                ? userGroupMemberRepository
                .findByGroup_IdAndUser_RoleAndUser_ActivationStatusAndUser_ActiveTrueAndUser_IsDeletedFalseOrderByUserUsernameAsc(
                        lead.getAssignedGroupId(),
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

        User ownerUser = userRepository.findByIdAndIsDeletedFalse(request.getOwnerUserId())
                .orElseThrow(() -> new EntityNotFoundException("Allocator user not found"));
        if (!ownerUser.isActive() || ownerUser.getActivationStatus() != ActivationStatus.ACTIVE) {
            throw new IllegalStateException("Selected allocator must be an active user");
        }
        if (!canAssignAllocator(actor, ownerUser)) {
            throw new AccessDeniedException("You do not have permission to assign this allocator");
        }

        if (row.getAssignedGroupId() != null) {
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

        Map<Long, String> cpNameMap = new HashMap<>();
        if (saved.getChannelPartnerId() != null) {
            channelPartnerRepository.findByIdAndDeletedFalse(saved.getChannelPartnerId()).ifPresent(cp ->
                    cpNameMap.put(cp.getId(), StringUtils.hasText(cp.getCompanyName()) ? cp.getCompanyName() : cp.getPartnerName()));
        }

        Map<Long, String> groupNameMap = loadGroupNameMap(List.of(saved));
        Map<Long, String> userNameMap = loadUserNameMap(List.of(saved));

        return toResponse(saved, cpNameMap, groupNameMap, userNameMap);
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
        if (row.getAssignedGroupId() != null) {
            return visibleGroupIds.contains(row.getAssignedGroupId());
        }
        if (row.getOwnerUserId() != null) {
            return Objects.equals(row.getOwnerUserId(), actor.getId());
        }
        return textEquals(row.getOwner(), actor.getUsername());
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
        return parseCsv(group == null ? null : group.getPageKeysCsv()).stream()
                .anyMatch(value -> LEADS_PAGE_KEY.equalsIgnoreCase(value));
    }

    private boolean memberHasLeadVisibility(UserGroupMember membership) {
        return parseCsv(membership == null ? null : membership.getPageKeysCsv()).stream()
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
        res.setName(row.getName());
        res.setEmail(row.getEmail());
        res.setMobile(row.getMobile());
        res.setPrimarySource(row.getPrimarySource());
        res.setSecondarySource(row.getSecondarySource());
        res.setTertiarySource(row.getTertiarySource());
        res.setProjectName(row.getProjectName());
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

        res.setCreatedAt(row.getCreatedAt());
        return res;
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
