package com.nexorcrm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LeadUpdateStatusRequest {

    @NotBlank(message = "Status is required")
    @Size(max = 100, message = "Status must be at most 100 characters")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

