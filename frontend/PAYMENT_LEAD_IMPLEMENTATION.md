# Payment Lead Management System - Implementation Guide

## Overview

This document describes the implementation of the Payment Lead Management System with three key features:

1. **Round-robin Assignment** - Automatic lead distribution among payment and design team members (each status uses its own rotation)
2. **Customer Status Updates** - Synchronized status updates with customer records
3. **Notification Alerts** - Real-time alerts for new payment leads

---

## Architecture

### Components

#### 1. **PaymentLeadChatPage.jsx**
- New dedicated page for payment lead follow-up
- Route: `/payment-lead-chat`
- Features:
  - List all leads in "Payment" status
  - Real-time polling for new payment leads (every 10 seconds)
  - Dedicated chat interface with "With Customer" and "Internal Notes" tabs
  - Auto-assignment button for round-robin distribution
  - File attachment support for payment-related documents

#### 2. **LeadsPage.jsx** (Updated)
- Enhanced with Payment and Design status handling
- When a lead transitions to "Payment", "Design" or "Production" status:
  - Automatically performs round-robin assignment to the appropriate group
    (design/production leads go to the group defined for the corresponding
    rule in the flow)
  - The previous payment owner is saved in `paymentOwnerId` so that the lead
    continues to appear in the payment team's view during the design/production
    stage; when the lead later returns to Payment status ownership is restored
    from that field.
  - (For payment only) Updates customer status to "Payment"
  - Shows confirmation notifications

#### 3. **Configuration Files**
- `src/config/paymentLeadConfig.js` - Centralized configuration
- `src/utils/roundRobinHelper.js` - Round-robin utility functions

---

## Feature Details

### 1. Round-Robin Assignment

**How it works:**

When a lead transitions to Payment **or Design** status, the system automatically assigns it to the next team member in rotation for the corresponding group.

**Process:**
```javascript
// In LeadsPage.jsx - saveStatusUpdate() function
1. Get all assignable allocators for the lead
2. Find current owner's position in the list
3. Calculate next position: (currentIndex + 1) % allocators.length
4. Assign lead to the next allocator
5. Update lead's targetGroupId to payment group
```

**Configuration:**
```javascript
// src/config/paymentLeadConfig.js
ROUND_ROBIN: {
  ENABLED: true,
  METHOD: "strict", // Can be "workload-balanced" in future
  AUTO_ASSIGN_ON_PAYMENT_STATUS: true,
  TRACK_ASSIGNMENT_HISTORY: true,
}
```

**Files involved:**
- `src/pages/admin/LeadsPage.jsx` - Status update with assignment
- `src/pages/admin/PaymentLeadChatPage.jsx` - Manual reassignment via "Auto-Assign" button
- `src/utils/roundRobinHelper.js` - Helper functions
- `src/api/leadsApi.js` - `updateLeadAllocator()` API call

**API Calls:**
```javascript
// Get assignable team members
const allocators = await getAssignableAllocators(leadId);

// Update allocator
await updateLeadAllocator(leadId, newOwnerId, paymentGroupId);
```

---

### 2. Customer Status Updates

**How it works:**

When a lead transitions to Payment status, the customer's record is automatically updated to reflect this change.

**Process:**
```javascript
// Triggered during status update
1. When status changes to "Payment" in LeadsPage
2. Call updateCustomerLeadStatus("Payment")
3. Customer sidebar/dashboard automatically reflects new status
4. Create audit trail of status change
```

**Configuration:**
```javascript
UPDATE_CUSTOMER_STATUS_ON_PAYMENT: true,
CUSTOMER_STATUS_VALUE: "Payment",
```

**Files involved:**
- `src/pages/admin/LeadsPage.jsx` - Initiates customer status update
- `src/api/customerApi.js` - `updateCustomerLeadStatus()` function
- `src/pages/customer/CustomerStatusPage.jsx` - Shows status to customer

**API Calls:**
```javascript
// Update customer status
await updateCustomerLeadStatus("Payment");
```

**Error Handling:**
The customer status update is wrapped in try-catch to not block the main lead status update if it fails.

---

### 3. Notification Alerts

**How it works:**

The PaymentLeadChatPage continuously polls the server for new payment leads and displays alerts when new leads arrive.

**Process:**
```javascript
// In PaymentLeadChatPage.jsx - useEffect
1. Initial load: Fetch all leads with status "Payment"
2. Set up polling interval (10 seconds)
3. Each poll:
   - Fetch updated list
   - Compare current count with previous count
   - If new leads: Show alert with count
   - Auto-hide after 5 seconds
4. Continue polling until component unmounts
```

**Polling Configuration:**
```javascript
PAYMENT_LEADS_POLL_INTERVAL: 10000, // 10 seconds
NOTIFICATION_AUTO_HIDE_DURATION: 5000, // 5 seconds
CHAT_MESSAGES_POLL_INTERVAL: 8000, // 8 seconds
```

**Notification Types:**
- **Success** (green): Round-robin assignment successful
- **Info** (light blue): New payment leads arrived
- **Error** (red): Assignment or chat errors
- **Warning** (yellow): Future use for warnings

**Files involved:**
- `src/pages/admin/PaymentLeadChatPage.jsx` - Polling and alerts
- `src/config/paymentLeadConfig.js` - Alert configuration

---

## User Workflows

### Workflow 1: Lead Transitions to Payment Status

**In LeadsPage:**
```
1. User selects a lead in a status prior to payment
2. Opens Status Change Modal
3. Selects "Payment" as new status
4. Clicks "Save Status"
5. System:
   - Updates lead status to "Payment"
   - Performs round-robin assignment
   - Updates customer status
   - Shows: "✓ Lead moved to Payment status with round-robin assignment"
```

**Lead moves from LeadsPage to PaymentLeadChatPage**

---

### Workflow 2: Payment Team Member Works on Lead

**In PaymentLeadChatPage:**
```
1. Lead appears in left sidebar (auto-updated via polling)
2. User clicks on lead to select it
3. Chat interface loads with:
   - "With Customer" tab (for payment discussions)
   - "Internal Notes" tab (for team notes)
4. User can:
   - Chat with customer about payment
   - Attach invoices/receipts
   - View lead details
   - Reassign using "Auto-Assign" button
5. Selected lead's owner is shown with badge
```

---

### Workflow 3: Reassign Payment Lead

**In PaymentLeadChatPage:**
```
1. Payment team member opens a lead
2. Clicks "Auto-Assign" button
3. System:
   - Gets current owner's position
   - Assigns to next member in rotation
   - Updates display in real-time
   - Shows: "✓ Lead assigned to [name] for payment follow-up"
4. Lead disappears from current user's list
5. Appears in next assignee's list
```

---

## Data Flow

### Adding a Lead to Payment Status

```
LeadsPage
    ↓
saveStatusUpdate()
    ↓
(1) updateLeadRowStatus(id, "Payment")
    ↓ API: /api/v1/leads/{id}/status
    ↓ Backend updates lead.status = "Payment"
    ↓
(2) getAssignableAllocators(id)
    ↓ API: /api/v1/leads/{id}/assignable-allocators
    ↓ Backend returns list of payment team members
    ↓
(3) Calculate round-robin: nextIndex = (currentIndex + 1) % length
    ↓
(4) updateLeadAllocator(id, nextOwnerId, paymentGroupId)
    ↓ API: /api/v1/leads/{id}/allocator
    ↓ Backend updates lead.ownerUserId
    ↓
(5) updateCustomerLeadStatus("Payment")
    ↓ API: /api/customer/lead/status
    ↓ Backend updates customer.lastLeadStatus = "Payment"
    ↓
Lead appears in PaymentLeadChatPage for assigned user
```

### New Payment Lead Arrives

```
Backend
    ↓
Create/Update lead with status = "Payment"
    ↓
PaymentLeadChatPage (Client)
    ↓
Polling interval triggers every 10 seconds
    ↓
getLeads({ status: "Payment" })
    ↓ API: /api/v1/leads?status=Payment
    ↓ Backend returns all "Payment" leads
    ↓
Compare count: new count > old count
    ↓
Show notification: "🔔 1 new payment lead(s) arrived!"
    ↓
Auto-add to left sidebar list
    ↓
Auto-hide notification after 5 seconds
```

---

## Configuration Guide

### Modify Polling Intervals

**File:** `src/config/paymentLeadConfig.js`

```javascript
PAYMENT_LEADS_POLL_INTERVAL: 5000,  // Change to 5 seconds
CHAT_MESSAGES_POLL_INTERVAL: 6000,  // Change to 6 seconds
```

### Enable Workload-Balanced Assignment

**File:** `src/config/paymentLeadConfig.js`

```javascript
ROUND_ROBIN: {
  METHOD: "workload-balanced", // Instead of "strict"
}
```

This will assign leads to the team member with the least workload.

### Disable Auto Assignment

**File:** `src/config/paymentLeadConfig.js`

```javascript
ROUND_ROBIN: {
  AUTO_ASSIGN_ON_PAYMENT_STATUS: false,
}
```

### Customize Messages

**File:** `src/config/paymentLeadConfig.js`

```javascript
MESSAGES: {
  ROUND_ROBIN_SUCCESS: (ownerName) => `Lead assigned to ${ownerName}!`,
  NEW_LEAD_ALERT: (count) => `${count} new payment lead(s)!`,
}
```

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/leads?status=Payment` | GET | Fetch leads in Payment status |
| `/api/v1/leads/{id}/status` | PATCH | Update lead status |
| `/api/v1/leads/{id}/assignable-allocators` | GET | Get team members for assignment |
| `/api/v1/leads/{id}/allocator` | PATCH | Update lead owner |
| `/api/customer/lead/status` | PATCH | Update customer status |
| `/api/v1/leads/{id}/chat/messages` | GET | Fetch chat messages |
| `/api/v1/leads/{id}/chat/messages` | POST | Send chat message |
| `/api/v1/leads/{id}/chat/messages/file` | POST | Upload file attachment |

---

## Error Handling

### Payment Status Update Failed
- User sees error message
- Lead status remains unchanged
- No round-robin assignment occurs

### Customer Status Update Failed
- Lead status change still succeeds
- Warning logged to console
- User continues normally

### Round-Robin Assignment Failed
- User sees: "Failed to assign lead in payment group"
- Lead status may be updated but owner remains same
- Manual "Auto-Assign" button allows retry

### Chat Message Failed
- Error notification shown
- Message not sent
- User can retry

---

## Testing Checklist

- [ ] Lead transitions to Payment status
- [ ] Round-robin assigns to next team member
- [ ] Customer status updates in real-time
- [ ] New payment leads appear in PaymentLeadChatPage
- [ ] Chat works with customer and internal tabs
- [ ] File attachments upload correctly
- [ ] "Auto-Assign" button reassigns correctly
- [ ] Notifications appear and auto-hide
- [ ] Search by name/email/mobile works
- [ ] Owner name displays in lead list
- [ ] Clicking lead details opens in new tab

---

## Future Enhancements

1. **Workload Balancing** - Assign to team member with least workload
2. **Assignment History** - Track all assignments in audit log
3. **SLA Tracking** - Track time in Payment status
4. **Bulk Assignment** - Reassign multiple leads at once
5. **Assignment Analytics** - Dashboard showing assignment patterns
6. **Custom Payment Groups** - Configure different groups per scenario
7. **Scheduled Reminders** - Remind team about pending payments
8. **Payment Confirmation** - Mark payment received with proof upload

---

## Support & Troubleshooting

### Issue: New leads aren't showing up
**Solution:** Check polling interval configuration, verify API `/api/v1/leads?status=Payment` returns data

### Issue: Round-robin not working
**Solution:** Verify allocators exist via API call, check that lead group is configured

### Issue: Customer status not updating
**Solution:** Check customer API endpoint, verify user has permission to update customer

### Issue: Chat messages not loading
**Solution:** Check chat message API, verify threadType parameter is sent correctly

---

## Code Files Summary

| File | Purpose | Key Functions |
|------|---------|---|
| `src/pages/admin/PaymentLeadChatPage.jsx` | Payment lead management interface | `performRoundRobinAssignment`, `updatePaymentStatusWithAssignment` |
| `src/pages/admin/LeadsPage.jsx` | Lead management with Payment status handler | `saveStatusUpdate` (enhanced) |
| `src/config/paymentLeadConfig.js` | Configuration center | `PAYMENT_LEAD_CONFIG`, `getPaymentGroup` |
| `src/utils/roundRobinHelper.js` | Round-robin utilities | `getNextAllocatorInRotation`, `getOptimalAssignee` |
| `src/api/leadsApi.js` | Lead API calls | `updateLeadAllocator` (new import) |
| `src/api/customerApi.js` | Customer API calls | `updateCustomerLeadStatus` (existing) |
| `src/adminPhpRoutes.js` | Routing configuration | New route: `payment-lead-chat` |
| `src/pages/admin/PaymentsPage.jsx` | Enhanced with Payment Lead Chat link | Button to access PaymentLeadChatPage |

---

## Contact & Questions

For implementation questions or issues, refer to the configuration file comments or check the component implementations for detailed logic.
