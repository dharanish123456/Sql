package com.nexorcrm.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lead_id", nullable = false, unique = true, length = 64)
    private String leadId;

    @Column(name = "euid", nullable = false)
    private Long euid;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "email", length = 190)
    private String email;

    @Column(name = "email_normalized", length = 190)
    private String emailNormalized;

    @Column(name = "mobile", nullable = false, length = 40)
    private String mobile;

    @Column(name = "mobile_normalized", nullable = false, length = 40)
    private String mobileNormalized;

    @Column(name = "country_code", length = 20)
    private String countryCode;

    @Column(name = "alternate_phone", length = 40)
    private String alternatePhone;

    @Column(name = "alternate_email", length = 190)
    private String alternateEmail;

    @Column(name = "primary_source", nullable = false, length = 160)
    private String primarySource;

    @Column(name = "secondary_source", length = 160)
    private String secondarySource;

    @Column(name = "tertiary_source", length = 160)
    private String tertiarySource;

    @Column(name = "project_name", length = 200)
    private String projectName;

    @Column(name = "occupation", length = 200)
    private String occupation;

    @Column(name = "company_name", length = 200)
    private String companyName;

    @Column(name = "lead_type", length = 160)
    private String leadType;

    @Column(name = "channel_partner_id")
    private Long channelPartnerId;

    @Column(name = "status", nullable = false, length = 100)
    private String status;

    @Column(name = "sv_status", length = 100)
    private String svStatus;

    @Column(name = "owner", nullable = false, length = 120)
    private String owner;

    @Column(name = "assigned_group_id")
    private Long assignedGroupId;

    @Column(name = "allocator_user_id")
    private Long allocatorUserId;

    @Column(name = "owner_user_id")
    private Long ownerUserId;

    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;

    @Column(name = "attempted_open_reason", length = 160)
    private String attemptedOpenReason;

    @Column(name = "attempted_call_status", length = 160)
    private String attemptedCallStatus;

    @Column(name = "attempted_call_remarks", length = 1000)
    private String attemptedCallRemarks;

    @Column(name = "interested_follow_up_date")
    private LocalDateTime interestedFollowUpDate;

    @Column(name = "interested_call_remarks", length = 1000)
    private String interestedCallRemarks;

    @Column(name = "rejected_reason", length = 200)
    private String rejectedReason;

    @Column(name = "rejected_reason_subtype", length = 500)
    private String rejectedReasonSubtype;

    // payment tracking
    @Column(name = "total_amount", precision = 14, scale = 2)
    private java.math.BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 14, scale = 2)
    private java.math.BigDecimal paidAmount;

    @Column(name = "remaining_amount", precision = 14, scale = 2)
    private java.math.BigDecimal remainingAmount;

    @Column(name = "design_start_at")
    private LocalDateTime designStartAt;

    @Column(name = "design_end_at")
    private LocalDateTime designEndAt;

    // owner of the lead while it is in payment status; preserved when the lead
    // moves into "design" so we can restore ownership when it returns to
    // payment. not null only during design phase.
    @Column(name = "payment_owner_id")
    private Long paymentOwnerId;

    // when a lead is sent into design we choose an employee from the
    // design group with a round‑robin algorithm. if the lead leaves
    // design and later returns, we want to restore the same employee
    // rather than picking a new one.
    @Column(name = "design_owner_id")
    private Long designOwnerId;

    // when a lead is sent into production we choose an employee from the
    // production group with a round‑robin algorithm. if the lead leaves
    // production and later returns, we want to restore the same employee
    // rather than picking a new one; this field holds the previously assigned
    // production owner until it has been reapplied. cleared when used.
    @Column(name = "production_owner_id")
    private Long productionOwnerId;

    // requirement fields
    @Column(name = "requirement_type", length = 100)
    private String requirementType;

    @Column(name = "requirement_file_name", length = 200)
    private String requirementFileName;

    @Column(name = "requirement_file_path", length = 1000)
    private String requirementFilePath;

    @Column(name = "requirement_file_type", length = 100)
    private String requirementFileType;

    @Column(name = "requirement_file_size")
    private Long requirementFileSize;

    @Column(name = "requirement_notes", columnDefinition = "LONGTEXT")
    private String requirementNotes;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "New Lead";
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getLeadId() { return leadId; }
    public void setLeadId(String leadId) { this.leadId = leadId; }
    public Long getEuid() { return euid; }
    public void setEuid(Long euid) { this.euid = euid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEmailNormalized() { return emailNormalized; }
    public void setEmailNormalized(String emailNormalized) { this.emailNormalized = emailNormalized; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getMobileNormalized() { return mobileNormalized; }
    public void setMobileNormalized(String mobileNormalized) { this.mobileNormalized = mobileNormalized; }
    public String getPrimarySource() { return primarySource; }
    public void setPrimarySource(String primarySource) { this.primarySource = primarySource; }
    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }
    public String getSecondarySource() { return secondarySource; }
    public void setSecondarySource(String secondarySource) { this.secondarySource = secondarySource; }
    public String getTertiarySource() { return tertiarySource; }
    public void setTertiarySource(String tertiarySource) { this.tertiarySource = tertiarySource; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLeadType() { return leadType; }
    public void setLeadType(String leadType) { this.leadType = leadType; }
    public Long getChannelPartnerId() { return channelPartnerId; }
    public void setChannelPartnerId(Long channelPartnerId) { this.channelPartnerId = channelPartnerId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSvStatus() { return svStatus; }
    public void setSvStatus(String svStatus) { this.svStatus = svStatus; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public Long getAssignedGroupId() { return assignedGroupId; }
    public void setAssignedGroupId(Long assignedGroupId) { this.assignedGroupId = assignedGroupId; }
    public Long getAllocatorUserId() { return allocatorUserId; }
    public void setAllocatorUserId(Long allocatorUserId) { this.allocatorUserId = allocatorUserId; }
    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }
    public LocalDateTime getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDateTime followUpDate) { this.followUpDate = followUpDate; }
    public String getAttemptedOpenReason() { return attemptedOpenReason; }
    public void setAttemptedOpenReason(String attemptedOpenReason) { this.attemptedOpenReason = attemptedOpenReason; }
    public String getAttemptedCallStatus() { return attemptedCallStatus; }
    public void setAttemptedCallStatus(String attemptedCallStatus) { this.attemptedCallStatus = attemptedCallStatus; }
    public String getAttemptedCallRemarks() { return attemptedCallRemarks; }
    public void setAttemptedCallRemarks(String attemptedCallRemarks) { this.attemptedCallRemarks = attemptedCallRemarks; }
    public LocalDateTime getInterestedFollowUpDate() { return interestedFollowUpDate; }
    public void setInterestedFollowUpDate(LocalDateTime interestedFollowUpDate) { this.interestedFollowUpDate = interestedFollowUpDate; }
    public String getInterestedCallRemarks() { return interestedCallRemarks; }
    public void setInterestedCallRemarks(String interestedCallRemarks) { this.interestedCallRemarks = interestedCallRemarks; }
    public String getRejectedReason() { return rejectedReason; }
    public void setRejectedReason(String rejectedReason) { this.rejectedReason = rejectedReason; }
    public String getRejectedReasonSubtype() { return rejectedReasonSubtype; }
    public void setRejectedReasonSubtype(String rejectedReasonSubtype) { this.rejectedReasonSubtype = rejectedReasonSubtype; }

    public java.math.BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(java.math.BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public java.math.BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(java.math.BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public java.math.BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(java.math.BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public LocalDateTime getDesignStartAt() { return designStartAt; }
    public void setDesignStartAt(LocalDateTime designStartAt) { this.designStartAt = designStartAt; }

    public LocalDateTime getDesignEndAt() { return designEndAt; }
    public void setDesignEndAt(LocalDateTime designEndAt) { this.designEndAt = designEndAt; }

    public Long getPaymentOwnerId() { return paymentOwnerId; }
    public void setPaymentOwnerId(Long paymentOwnerId) { this.paymentOwnerId = paymentOwnerId; }

    public Long getDesignOwnerId() { return designOwnerId; }
    public void setDesignOwnerId(Long designOwnerId) { this.designOwnerId = designOwnerId; }

    public Long getProductionOwnerId() { return productionOwnerId; }
    public void setProductionOwnerId(Long productionOwnerId) { this.productionOwnerId = productionOwnerId; }

    public String getRequirementType() { return requirementType; }
    public void setRequirementType(String requirementType) { this.requirementType = requirementType; }

    public String getRequirementFileName() { return requirementFileName; }
    public void setRequirementFileName(String requirementFileName) { this.requirementFileName = requirementFileName; }

    public String getRequirementFilePath() { return requirementFilePath; }
    public void setRequirementFilePath(String requirementFilePath) { this.requirementFilePath = requirementFilePath; }

    public String getRequirementFileType() { return requirementFileType; }
    public void setRequirementFileType(String requirementFileType) { this.requirementFileType = requirementFileType; }

    public Long getRequirementFileSize() { return requirementFileSize; }
    public void setRequirementFileSize(Long requirementFileSize) { this.requirementFileSize = requirementFileSize; }

    public String getRequirementNotes() { return requirementNotes; }
    public void setRequirementNotes(String requirementNotes) { this.requirementNotes = requirementNotes; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
