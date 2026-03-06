package com.nexorcrm.backend.repo;

import com.nexorcrm.backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByDeletedFalseOrderByCreatedAtDesc();
    List<Lead> findByDeletedFalseAndChannelPartnerIdOrderByCreatedAtDesc(Long channelPartnerId);
    List<Lead> findByDeletedFalseAndAssignedGroupIdOrderByCreatedAtDesc(Long assignedGroupId);
    List<Lead> findByDeletedFalseAndOwnerUserIdOrderByCreatedAtDesc(Long ownerUserId);
    Optional<Lead> findByIdAndDeletedFalse(Long id);
    Optional<Lead> findTopByDeletedFalseAndEmailNormalizedOrderByCreatedAtDesc(String emailNormalized);

    boolean existsByDeletedFalseAndProjectNameIgnoreCaseAndMobileNormalized(String projectName, String mobileNormalized);

    boolean existsByDeletedFalseAndProjectNameIgnoreCaseAndEmailNormalized(String projectName, String emailNormalized);

    long countByDeletedFalse();
}
