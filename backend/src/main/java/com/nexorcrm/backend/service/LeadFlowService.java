package com.nexorcrm.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexorcrm.backend.dto.LeadFlowRequest;
import com.nexorcrm.backend.dto.LeadFlowResponse;
import com.nexorcrm.backend.entity.LeadFlowConfig;
import com.nexorcrm.backend.repo.LeadFlowConfigRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class LeadFlowService {

    private static final Long FLOW_ID = 1L;

    private final LeadFlowConfigRepository leadFlowConfigRepository;
    private final ObjectMapper objectMapper;
    private final ObjectProvider<LeadService> leadServiceProvider;

    public LeadFlowService(LeadFlowConfigRepository leadFlowConfigRepository,
                           ObjectMapper objectMapper,
                           ObjectProvider<LeadService> leadServiceProvider) {
        this.leadFlowConfigRepository = leadFlowConfigRepository;
        this.objectMapper = objectMapper;
        this.leadServiceProvider = leadServiceProvider;
    }

    @Transactional(readOnly = true)
    public LeadFlowResponse getFlow() {
        LeadFlowConfig config = leadFlowConfigRepository.findById(FLOW_ID).orElseGet(() -> {
            LeadFlowConfig created = new LeadFlowConfig();
            created.setId(FLOW_ID);
            return created;
        });
        return toResponse(config);
    }

    @Transactional
    public LeadFlowResponse updateFlow(LeadFlowRequest request, String actorPrincipal) {
        LeadFlowConfig config = leadFlowConfigRepository.findById(FLOW_ID).orElseGet(() -> {
            LeadFlowConfig created = new LeadFlowConfig();
            created.setId(FLOW_ID);
            return created;
        });
        config.setDefaultGroupId(request.getDefaultGroupId());
        config.setRulesJson(serializeRules(request.getRules()));
        if (StringUtils.hasText(actorPrincipal)) {
            config.setUpdatedBy(actorPrincipal);
        }
        LeadFlowConfig saved = leadFlowConfigRepository.save(config);

        // after updating the flow configuration we need to ensure any existing
        // leads that are currently sitting in a status whose handled-by group was
        // just changed get reassigned to a member of the new group.  this keeps
        // the UI consistent (owner matches the flow) and prevents leads from
        // remaining owned by a payment user when they should belong to another team.
        try {
            LeadService leadService = leadServiceProvider.getIfAvailable();
            if (leadService != null) {
                leadService.reassignLeadsForFlow(request.getRules());
            }
        } catch (Exception ignore) {
            // don't let reassign failures block the flow update
        }

        return toResponse(saved);
    }

    private String serializeRules(List<Map<String, Object>> rules) {
        try {
            if (rules == null) {
                return null;
            }
            return objectMapper.writeValueAsString(rules);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to save flow rules");
        }
    }

    private List<Map<String, Object>> parseRules(String json) {
        try {
            if (!StringUtils.hasText(json)) {
                return Collections.emptyList();
            }
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private LeadFlowResponse toResponse(LeadFlowConfig config) {
        LeadFlowResponse response = new LeadFlowResponse();
        response.setDefaultGroupId(config.getDefaultGroupId());
        response.setRules(parseRules(config.getRulesJson()));
        response.setUpdatedBy(config.getUpdatedBy());
        response.setUpdatedAt(config.getUpdatedAt());
        return response;
    }
}
