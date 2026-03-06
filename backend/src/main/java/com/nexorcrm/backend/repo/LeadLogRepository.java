package com.nexorcrm.backend.repo;

import com.nexorcrm.backend.entity.LeadLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadLogRepository extends JpaRepository<LeadLog, Long> {
    List<LeadLog> findByLeadIdOrderByCreatedAtDesc(Long leadId);
}
