package com.nexorcrm.backend.repo;

import com.nexorcrm.backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByDeletedFalseOrderByCreatedAtDesc();
    List<Lead> findByDeletedFalseAndChannelPartnerIdOrderByCreatedAtDesc(Long channelPartnerId);
    List<Lead> findByDeletedFalseAndAssignedGroupIdOrderByCreatedAtDesc(Long assignedGroupId);
    Optional<Lead> findByIdAndDeletedFalse(Long id);

    boolean existsByDeletedFalseAndProjectNameIgnoreCaseAndMobileNormalized(String projectName, String mobileNormalized);

    boolean existsByDeletedFalseAndProjectNameIgnoreCaseAndEmailNormalized(String projectName, String emailNormalized);
}
