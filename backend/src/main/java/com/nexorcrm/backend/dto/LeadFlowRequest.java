package com.nexorcrm.backend.dto;

import java.util.List;
import java.util.Map;

public class LeadFlowRequest {
    private Long defaultGroupId;
    private List<Map<String, Object>> rules;

    public Long getDefaultGroupId() {
        return defaultGroupId;
    }

    public void setDefaultGroupId(Long defaultGroupId) {
        this.defaultGroupId = defaultGroupId;
    }

    public List<Map<String, Object>> getRules() {
        return rules;
    }

    public void setRules(List<Map<String, Object>> rules) {
        this.rules = rules;
    }
}
