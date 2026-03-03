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

    @Column(name = "primary_source", nullable = false, length = 160)
    private String primarySource;

    @Column(name = "secondary_source", length = 160)
    private String secondarySource;

    @Column(name = "tertiary_source", length = 160)
    private String tertiarySource;

    @Column(name = "project_name", length = 200)
    private String projectName;

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
    public String getSecondarySource() { return secondarySource; }
    public void setSecondarySource(String secondarySource) { this.secondarySource = secondarySource; }
    public String getTertiarySource() { return tertiarySource; }
    public void setTertiarySource(String tertiarySource) { this.tertiarySource = tertiarySource; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
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
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
