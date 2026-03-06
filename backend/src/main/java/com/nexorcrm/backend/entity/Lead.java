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

    @Column(name = "boq_amount", precision = 14, scale = 2)
    private java.math.BigDecimal boqAmount;

    @Column(name = "boq_file_name", length = 255)
    private String boqFileName;

    @Column(name = "boq_file_path", length = 500)
    private String boqFilePath;

    @Column(name = "boq_file_type", length = 120)
    private String boqFileType;

    @Column(name = "boq_file_size")
    private Long boqFileSize;
    @Column(name = "boq_notes", columnDefinition = "text")
    private String boqNotes;

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
    public java.math.BigDecimal getBoqAmount() { return boqAmount; }
    public void setBoqAmount(java.math.BigDecimal boqAmount) { this.boqAmount = boqAmount; }
    public String getBoqFileName() { return boqFileName; }
    public void setBoqFileName(String boqFileName) { this.boqFileName = boqFileName; }
    public String getBoqFilePath() { return boqFilePath; }
    public void setBoqFilePath(String boqFilePath) { this.boqFilePath = boqFilePath; }
    public String getBoqFileType() { return boqFileType; }
    public void setBoqFileType(String boqFileType) { this.boqFileType = boqFileType; }
    public Long getBoqFileSize() { return boqFileSize; }
    public void setBoqFileSize(Long boqFileSize) { this.boqFileSize = boqFileSize; }
    public String getBoqNotes() { return boqNotes; }
    public void setBoqNotes(String boqNotes) { this.boqNotes = boqNotes; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
