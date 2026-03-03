package com.nexorcrm.backend.dto;

import java.time.LocalDateTime;

public class LeadResponse {
    private Long id;
    private String leadId;
    private String name;
    private String email;
    private String mobile;
    private String primarySource;
    private String secondarySource;
    private String tertiarySource;
    private String projectName;
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
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLeadId() { return leadId; }
    public void setLeadId(String leadId) { this.leadId = leadId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getPrimarySource() { return primarySource; }
    public void setPrimarySource(String primarySource) { this.primarySource = primarySource; }
    public String getSecondarySource() { return secondarySource; }
    public void setSecondarySource(String secondarySource) { this.secondarySource = secondarySource; }
    public String getTertiarySource() { return tertiarySource; }
    public void setTertiarySource(String tertiarySource) { this.tertiarySource = tertiarySource; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
