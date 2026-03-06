package com.nexorcrm.backend.dto;

import java.time.LocalDateTime;

public class LeadResponse {
    private Long id;
    private String leadId;
    private Long euid;
    private String name;
    private String email;
    private String mobile;
    private String countryCode;
    private String alternatePhone;
    private String alternateEmail;
    private String primarySource;
    private String secondarySource;
    private String tertiarySource;
    private String projectName;
    private String occupation;
    private String companyName;
    private String leadType;
    private Long channelPartnerId;
    private String channelPartnerName;
    private String status;
    private String svStatus;
    private Long leadGroupId;
    private String leadGroupName;
    private Long allocatorUserId;
    private String allocator;
    private Long ownerUserId;
    private String owner;
    private LocalDateTime followUpDate;
    private String attemptedOpenReason;
    private String attemptedCallStatus;
    private String attemptedCallRemarks;
    private LocalDateTime interestedFollowUpDate;
    private String interestedCallRemarks;
    private String rejectedReason;
    private String rejectedReasonSubtype;
    private java.math.BigDecimal boqAmount;
    private String boqFileName;
    private String boqFilePath;
    private String boqFileType;
    private Long boqFileSize;
    private String boqNotes;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLeadId() { return leadId; }
    public void setLeadId(String leadId) { this.leadId = leadId; }
    public Long getEuid() { return euid; }
    public void setEuid(Long euid) { this.euid = euid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }
    public String getPrimarySource() { return primarySource; }
    public void setPrimarySource(String primarySource) { this.primarySource = primarySource; }
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
    public String getChannelPartnerName() { return channelPartnerName; }
    public void setChannelPartnerName(String channelPartnerName) { this.channelPartnerName = channelPartnerName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSvStatus() { return svStatus; }
    public void setSvStatus(String svStatus) { this.svStatus = svStatus; }
    public Long getLeadGroupId() { return leadGroupId; }
    public void setLeadGroupId(Long leadGroupId) { this.leadGroupId = leadGroupId; }
    public String getLeadGroupName() { return leadGroupName; }
    public void setLeadGroupName(String leadGroupName) { this.leadGroupName = leadGroupName; }
    public Long getAllocatorUserId() { return allocatorUserId; }
    public void setAllocatorUserId(Long allocatorUserId) { this.allocatorUserId = allocatorUserId; }
    public String getAllocator() { return allocator; }
    public void setAllocator(String allocator) { this.allocator = allocator; }
    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
