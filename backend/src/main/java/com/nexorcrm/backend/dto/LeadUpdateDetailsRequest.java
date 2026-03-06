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
}
