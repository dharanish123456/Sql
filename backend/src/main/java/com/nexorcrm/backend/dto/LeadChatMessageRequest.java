package com.nexorcrm.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LeadChatMessageRequest {
    @NotBlank(message = "threadType is required")
    private String threadType;
    @NotBlank(message = "message is required")
    private String message;

    public String getThreadType() { return threadType; }
    public void setThreadType(String threadType) { this.threadType = threadType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
