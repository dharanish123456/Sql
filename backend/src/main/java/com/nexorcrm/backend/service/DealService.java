package com.nexorcrm.backend.service;

import com.nexorcrm.backend.dto.DealResponse;
import com.nexorcrm.backend.entity.Deal;
import com.nexorcrm.backend.entity.Lead;
import com.nexorcrm.backend.entity.Role;
import com.nexorcrm.backend.entity.User;
import com.nexorcrm.backend.repo.DealRepository;
import com.nexorcrm.backend.repo.LeadRepository;
import com.nexorcrm.backend.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class DealService {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public DealService(DealRepository dealRepository, LeadRepository leadRepository, UserRepository userRepository) {
        this.dealRepository = dealRepository;
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a deal record the first time a lead transitions to "deal" status.
     * If a deal already exists for this lead, updates the snapshot fields.
     */
    public void createOrUpdateFromLead(Lead lead) {
        if (lead == null) return;
        Deal deal = dealRepository.findBySourceLeadIdAndDeletedFalse(lead.getId())
                .orElse(new Deal());
        deal.setSourceLeadId(lead.getId());
        deal.setName(lead.getName());
        deal.setEmail(lead.getEmail());
        deal.setMobile(lead.getMobile());
        deal.setCountryCode(lead.getCountryCode());
        deal.setPrimarySource(lead.getPrimarySource());
        deal.setSecondarySource(lead.getSecondarySource());
        deal.setTertiarySource(lead.getTertiarySource());
        deal.setProjectName(lead.getProjectName());
        deal.setCompanyName(lead.getCompanyName());
        deal.setOwner(lead.getOwner());
        deal.setOwnerUserId(lead.getOwnerUserId());
        deal.setTotalAmount(lead.getTotalAmount());
        deal.setPaidAmount(lead.getPaidAmount());
        deal.setRemainingAmount(lead.getRemainingAmount());
        deal.setInvoiceData(lead.getInvoiceData());
        deal.setInvoiceCgstPercent(lead.getInvoiceCgstPercent());
        deal.setInvoiceSgstPercent(lead.getInvoiceSgstPercent());
        deal.setStatus(lead.getStatus());
        if (deal.getConvertedAt() == null) {
            deal.setConvertedAt(LocalDateTime.now());
        }
        dealRepository.save(deal);
    }

    @Transactional(readOnly = true)
    public List<DealResponse> list(String actorPrincipal) {
        assertAccess(actorPrincipal);
        return dealRepository.findByDeletedFalseOrderByConvertedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DealResponse getById(Long id, String actorPrincipal) {
        assertAccess(actorPrincipal);
        Deal deal = dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Deal not found"));
        return toResponse(deal);
    }

    public void delete(Long id, String actorPrincipal) {
        User actor = assertAccess(actorPrincipal);
        if (actor.getRole() != Role.SUPER_ADMIN && actor.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admins can delete deals");
        }
        Deal deal = dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Deal not found"));
        deal.setDeleted(true);
        dealRepository.save(deal);
    }

    public DealResponse updateDetails(Long id, java.util.Map<String, Object> updates, String actorPrincipal) {
        assertAccess(actorPrincipal);
        Deal deal = dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Deal not found"));

        if (updates.containsKey("name") && updates.get("name") != null) {
            deal.setName(String.valueOf(updates.get("name")).trim());
        }
        if (updates.containsKey("email") && updates.get("email") != null) {
            deal.setEmail(normalizeNullable(String.valueOf(updates.get("email"))));
        }
        if (updates.containsKey("mobile") && updates.get("mobile") != null) {
            deal.setMobile(String.valueOf(updates.get("mobile")).trim());
        }
        if (updates.containsKey("countryCode") && updates.get("countryCode") != null) {
            deal.setCountryCode(normalizeNullable(String.valueOf(updates.get("countryCode"))));
        }
        if (updates.containsKey("primarySource") && updates.get("primarySource") != null) {
            deal.setPrimarySource(normalizeNullable(String.valueOf(updates.get("primarySource"))));
        }
        if (updates.containsKey("secondarySource") && updates.get("secondarySource") != null) {
            deal.setSecondarySource(normalizeNullable(String.valueOf(updates.get("secondarySource"))));
        }
        if (updates.containsKey("tertiarySource") && updates.get("tertiarySource") != null) {
            deal.setTertiarySource(normalizeNullable(String.valueOf(updates.get("tertiarySource"))));
        }
        if (updates.containsKey("projectName") && updates.get("projectName") != null) {
            deal.setProjectName(normalizeNullable(String.valueOf(updates.get("projectName"))));
        }
        if (updates.containsKey("companyName") && updates.get("companyName") != null) {
            deal.setCompanyName(normalizeNullable(String.valueOf(updates.get("companyName"))));
        }
        if (updates.containsKey("totalAmount") && updates.get("totalAmount") != null) {
            try {
                deal.setTotalAmount(new java.math.BigDecimal(String.valueOf(updates.get("totalAmount"))));
            } catch (Exception ignored) {}
        }

        Deal saved = dealRepository.save(deal);
        return toResponse(saved);
    }

    public DealResponse updateStatus(Long id, String newStatus, String actorPrincipal) {
        assertAccess(actorPrincipal);
        Deal deal = dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Deal not found"));
        deal.setStatus(newStatus);
        Deal saved = dealRepository.save(deal);
        
        // Auto-assign payment verification to deal owner when status changes to payment
        if ("payment".equalsIgnoreCase(newStatus) && deal.getOwnerUserId() != null && deal.getSourceLeadId() != null) {
            leadRepository.findByIdAndIsDeletedFalse(deal.getSourceLeadId()).ifPresent(lead -> {
                lead.setPaymentVerificationAssignedToUserId(deal.getOwnerUserId());
                leadRepository.save(lead);
            });
        }
        
        return toResponse(saved);
    }

    /**
     * Called from LeadService when a lead's status changes to payment.
     * Updates the related deal's status and auto-assigns payment verification to the deal owner.
     */
    public void syncLeadStatusToDeal(Long sourceLeadId, String leadStatus, String actorPrincipal) {
        dealRepository.findBySourceLeadIdAndDeletedFalse(sourceLeadId).ifPresent(deal -> {
            deal.setStatus(leadStatus);
            deal = dealRepository.save(deal);
            
            // Auto-assign payment verification to deal owner when status is payment
            if ("payment".equalsIgnoreCase(leadStatus) && deal.getOwnerUserId() != null) {
                leadRepository.findByIdAndIsDeletedFalse(sourceLeadId).ifPresent(lead -> {
                    lead.setPaymentVerificationAssignedToUserId(deal.getOwnerUserId());
                    leadRepository.save(lead);
                });
            }
        });
    }

    /**
     * Syncs invoice data from the source lead to its related deal.
     * Called whenever lead.invoiceData is updated so the deal stays current.
     */
    public void syncInvoiceDataToDeals(Long sourceLeadId, String invoiceData, java.math.BigDecimal cgstPercent, java.math.BigDecimal sgstPercent) {
        dealRepository.findBySourceLeadIdAndDeletedFalse(sourceLeadId).ifPresent(deal -> {
            if (invoiceData != null) deal.setInvoiceData(invoiceData);
            if (cgstPercent != null) deal.setInvoiceCgstPercent(cgstPercent);
            if (sgstPercent != null) deal.setInvoiceSgstPercent(sgstPercent);
            dealRepository.save(deal);
        });
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private User assertAccess(String principal) {
        if (!StringUtils.hasText(principal)) {
            throw new AccessDeniedException("Unauthenticated");
        }
        if (principal.contains("@")) {
            return userRepository.findByEmailAndIsDeletedFalse(principal.trim().toLowerCase(Locale.ROOT))
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
        }
        return userRepository.findByUsernameAndIsDeletedFalse(principal.trim())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private DealResponse toResponse(Deal deal) {
        DealResponse r = new DealResponse();
        r.setId(deal.getId());
        r.setSourceLeadId(deal.getSourceLeadId());
        r.setName(deal.getName());
        r.setEmail(deal.getEmail());
        r.setMobile(deal.getMobile());
        r.setCountryCode(deal.getCountryCode());
        r.setPrimarySource(deal.getPrimarySource());
        r.setSecondarySource(deal.getSecondarySource());
        r.setTertiarySource(deal.getTertiarySource());
        r.setProjectName(deal.getProjectName());
        r.setCompanyName(deal.getCompanyName());
        r.setOwner(deal.getOwner());
        r.setOwnerUserId(deal.getOwnerUserId());
        r.setTotalAmount(deal.getTotalAmount());
        r.setPaidAmount(deal.getPaidAmount());
        r.setRemainingAmount(deal.getRemainingAmount());
        r.setInvoiceData(deal.getInvoiceData());
        r.setInvoiceCgstPercent(deal.getInvoiceCgstPercent());
        r.setInvoiceSgstPercent(deal.getInvoiceSgstPercent());
        r.setStatus(deal.getStatus());
        r.setConvertedAt(deal.getConvertedAt());
        return r;
    }
}
