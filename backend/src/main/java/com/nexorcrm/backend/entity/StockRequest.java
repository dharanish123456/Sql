package com.nexorcrm.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_request")
public class StockRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Column(name = "requested_by")
    private Long requestedBy;

    @Column(name = "assigned_to")
    private Long assignedTo;

    @Column(name = "status", length = 50)
    private String status;

    @Lob
    @Column(name = "items", columnDefinition = "text")
    private String items; // JSON array of {categoryId, qty, ...}

    @Column(name = "purchase_value")
    private BigDecimal purchaseValue;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "budget_exceeded")
    private Boolean budgetExceeded = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Lead getLead() { return lead; }
    public void setLead(Lead lead) { this.lead = lead; }
    public Long getRequestedBy() { return requestedBy; }
    public void setRequestedBy(Long requestedBy) { this.requestedBy = requestedBy; }
    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }
    public BigDecimal getPurchaseValue() { return purchaseValue; }
    public void setPurchaseValue(BigDecimal purchaseValue) { this.purchaseValue = purchaseValue; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public Boolean getBudgetExceeded() { return budgetExceeded; }
    public void setBudgetExceeded(Boolean budgetExceeded) { this.budgetExceeded = budgetExceeded; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
