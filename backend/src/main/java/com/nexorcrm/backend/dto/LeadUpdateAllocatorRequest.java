package com.nexorcrm.backend.dto;

import jakarta.validation.constraints.NotNull;

public class LeadUpdateAllocatorRequest {
    @NotNull(message = "ownerUserId is required")
    private Long ownerUserId;

    public Long getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(Long ownerUserId) {
        this.ownerUserId = ownerUserId;
    }
}

