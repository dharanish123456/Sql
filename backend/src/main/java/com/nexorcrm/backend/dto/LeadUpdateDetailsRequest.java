package com.nexorcrm.backend.dto;

import java.time.LocalDateTime;

public class LeadUpdateDetailsRequest {
    private String alternatePhone;
    private String alternateEmail;
    private String countryCode;
    private LocalDateTime followUpDate;
    private String occupation;
    private String companyName;
    private String leadType;
    private String attemptedOpenReason;
    private String attemptedCallStatus;
    private String attemptedCallRemarks;
    private LocalDateTime interestedFollowUpDate;
    private String interestedCallRemarks;
    private String rejectedReason;
    private String rejectedReasonSubtype;

    // payment tracking
    private java.math.BigDecimal totalAmount;
    private java.math.BigDecimal paidAmount;
    private java.math.BigDecimal remainingAmount;
    private LocalDateTime designStartAt;
    private LocalDateTime designEndAt;

    // used by frontend to persist payment-owner reference
    private Long paymentOwnerId;

    // requirement fields
    private String requirementType;
    private String requirementFileName;
    private String requirementFilePath;
    private String requirementFileType;
    private Long requirementFileSize;
    private String requirementNotes;

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }
    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    public LocalDateTime getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDateTime followUpDate) { this.followUpDate = followUpDate; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLeadType() { return leadType; }
    public void setLeadType(String leadType) { this.leadType = leadType; }
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
}
