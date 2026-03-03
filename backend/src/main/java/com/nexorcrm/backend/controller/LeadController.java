package com.nexorcrm.backend.controller;

import com.nexorcrm.backend.dto.LeadCreateRequest;
import com.nexorcrm.backend.dto.LeadAllocatorOptionResponse;
import com.nexorcrm.backend.dto.LeadAssignableGroupResponse;
import com.nexorcrm.backend.dto.LeadFiltersResponse;
import com.nexorcrm.backend.dto.LeadResponse;
import com.nexorcrm.backend.dto.LeadUpdateAllocatorRequest;
import com.nexorcrm.backend.dto.LeadUpdateStatusRequest;
import com.nexorcrm.backend.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public List<LeadResponse> list(@RequestParam(required = false) String search,
                                   @RequestParam(required = false) String project,
                                   @RequestParam(required = false) String primary,
                                   @RequestParam(required = false) String status,
                                   @RequestParam(required = false) String svStatus,
                                   @RequestParam(required = false) String owner,
                                   @RequestParam(required = false) String quickDate,
                                   Authentication authentication) {
        return leadService.list(authentication.getName(), search, project, primary, status, svStatus, owner, quickDate);
    }

    @GetMapping("/{id}")
    public LeadResponse getById(@PathVariable("id") Long id, Authentication authentication) {
        return leadService.getById(id, authentication.getName());
    }

    @GetMapping("/filters")
    public LeadFiltersResponse filters(Authentication authentication) {
        return leadService.filters(authentication.getName());
    }

    @GetMapping("/assignable-groups")
    public List<LeadAssignableGroupResponse> listAssignableGroups(Authentication authentication) {
        return leadService.listAssignableGroups(authentication.getName());
    }

    @PostMapping
    public LeadResponse create(@Valid @RequestBody LeadCreateRequest request, Authentication authentication) {
        return leadService.create(request, authentication.getName());
    }

    @PatchMapping("/{id}/status")
    public LeadResponse updateStatus(@PathVariable("id") Long id,
                                     @Valid @RequestBody LeadUpdateStatusRequest request,
                                     Authentication authentication) {
        return leadService.updateStatus(id, request, authentication.getName());
    }

    @GetMapping("/{id}/assignable-allocators")
    public List<LeadAllocatorOptionResponse> listAssignableAllocators(@PathVariable("id") Long id,
                                                                      Authentication authentication) {
        return leadService.listAssignableAllocators(id, authentication.getName());
    }

    @PatchMapping("/{id}/allocator")
    public LeadResponse updateAllocator(@PathVariable("id") Long id,
                                        @Valid @RequestBody LeadUpdateAllocatorRequest request,
                                        Authentication authentication) {
        return leadService.updateAllocator(id, request, authentication.getName());
    }
}
