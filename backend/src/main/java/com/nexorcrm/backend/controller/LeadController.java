package com.nexorcrm.backend.controller;

import com.nexorcrm.backend.dto.LeadCreateRequest;
import com.nexorcrm.backend.dto.LeadAllocatorOptionResponse;
import com.nexorcrm.backend.dto.LeadAssignableGroupResponse;
import com.nexorcrm.backend.dto.LeadFiltersResponse;
import com.nexorcrm.backend.dto.LeadLogResponse;
import com.nexorcrm.backend.dto.LeadResponse;
import com.nexorcrm.backend.dto.LeadUpdateAllocatorRequest;
import com.nexorcrm.backend.dto.LeadUpdateDetailsRequest;
import com.nexorcrm.backend.dto.LeadUpdateStatusRequest;
import com.nexorcrm.backend.dto.ApiMessageResponse;
import com.nexorcrm.backend.service.LeadChatService;
import com.nexorcrm.backend.service.LeadService;
import com.nexorcrm.backend.repo.UserRepository;
import com.nexorcrm.backend.repo.LeadRepository;
import com.nexorcrm.backend.entity.Role;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;
    private final LeadChatService leadChatService;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;

    public LeadController(LeadService leadService,
                          LeadChatService leadChatService,
                          UserRepository userRepository,
                          LeadRepository leadRepository) {
        this.leadService = leadService;
        this.leadChatService = leadChatService;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
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

    @GetMapping("/{id}/log")
    public List<LeadLogResponse> getLeadLog(@PathVariable("id") Long id, Authentication authentication) {
        return leadService.listLeadLogs(id, authentication.getName());
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
                                                                      @RequestParam(value = "groupId", required = false) Long groupId,
                                                                      Authentication authentication) {
        return leadService.listAssignableAllocators(id, groupId, authentication.getName());
    }

    @PatchMapping("/{id}/allocator")
    public LeadResponse updateAllocator(@PathVariable("id") Long id,
                                        @Valid @RequestBody LeadUpdateAllocatorRequest request,
                                        Authentication authentication) {
        return leadService.updateAllocator(id, request, authentication.getName());
    }

    @PatchMapping("/{id}/details")
    public LeadResponse updateDetails(@PathVariable("id") Long id,
                                      @RequestBody LeadUpdateDetailsRequest request,
                                      Authentication authentication) {
        return leadService.updateDetails(id, request, authentication.getName());
    }

    @GetMapping("/{id}/chat/messages")
    public List<com.nexorcrm.backend.dto.LeadChatMessageResponse> listChatMessages(@PathVariable("id") Long id,
                                                                                  @RequestParam("threadType") String threadType,
                                                                                  Authentication authentication) {
        return leadChatService.listMessages(id,
                com.nexorcrm.backend.entity.LeadChatThreadType.valueOf(threadType.trim().toUpperCase()),
                authentication.getName());
    }

    @GetMapping("/chat/notifications")
    public List<com.nexorcrm.backend.dto.ChatNotificationResponse> listChatNotifications(
            @RequestParam(value = "since", required = false) String since,
            Authentication authentication) {
        String principal = authentication.getName();
        var actor = principal.contains("@")
                ? userRepository.findByEmailAndIsDeletedFalse(principal.trim().toLowerCase())
                .orElse(null)
                : userRepository.findByUsernameAndIsDeletedFalse(principal.trim())
                .orElse(null);
        List<Long> leadIds;
        if (actor != null && actor.getRole() == Role.EMPLOYEE) {
            leadIds = leadRepository.findByDeletedFalseAndOwnerUserIdOrderByCreatedAtDesc(actor.getId()).stream()
                    .map(com.nexorcrm.backend.entity.Lead::getId)
                    .filter(Objects::nonNull)
                    .toList();
        } else {
            List<LeadResponse> leads = leadService.list(authentication.getName(),
                    null, null, null, null, null, null, null);
            leadIds = leads.stream()
                    .map(LeadResponse::getId)
                    .filter(Objects::nonNull)
                    .toList();
        }
        return leadChatService.listNotifications(leadIds, authentication.getName(), since);
    }

    @PostMapping("/{id}/chat/messages")
    public com.nexorcrm.backend.dto.LeadChatMessageResponse sendChatMessage(@PathVariable("id") Long id,
                                                                            @Valid @RequestBody com.nexorcrm.backend.dto.LeadChatMessageRequest request,
                                                                            Authentication authentication) {
        return leadChatService.sendMessage(id, request, authentication.getName());
    }

    @PostMapping(value = "/{id}/chat/messages/file", consumes = {"multipart/form-data"})
    public com.nexorcrm.backend.dto.LeadChatMessageResponse sendChatMessageWithFile(@PathVariable("id") Long id,
                                                                                   @RequestParam("threadType") String threadType,
                                                                                   @RequestParam(value = "message", required = false) String message,
                                                                                   @RequestParam(value = "file", required = false) MultipartFile file,
                                                                                   Authentication authentication) {
        return leadChatService.sendMessageWithFile(id, threadType, message, file, authentication.getName());
    }

    @PatchMapping("/{id}/delete")
    public ApiMessageResponse deleteLead(@PathVariable("id") Long id, Authentication authentication) {
        leadService.deleteLead(id, authentication.getName());
        return new ApiMessageResponse("Lead deleted");
    }

    @PatchMapping(value = "/{id}/boq", consumes = {"multipart/form-data"})
    public LeadResponse updateBoq(@PathVariable("id") Long id,
                                  @RequestParam(value = "amount", required = false) BigDecimal amount,
                                  @RequestParam(value = "notes", required = false) String notes,
                                  @RequestParam(value = "file", required = false) MultipartFile file,
                                  Authentication authentication) {
        return leadService.updateBoq(id, amount, notes, file, authentication.getName());
    }

    @GetMapping("/{id}/boq/file")
    public ResponseEntity<Resource> getBoqFile(@PathVariable("id") Long id, Authentication authentication) {
        var lead = leadService.getBoqFileEntry(id, authentication.getName());
        String path = lead.getBoqFilePath();
        Resource resource = new org.springframework.core.io.FileSystemResource(path);
        if (!resource.exists() || !resource.isReadable()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "BOQ file not found");
        }

        String filename = lead.getBoqFileName();
        if (filename == null || filename.isBlank()) {
            filename = "boq-file";
        }
        filename = filename.replace("\"", "");

        String contentType = lead.getBoqFileType();
        MediaType mediaType;
        try {
            mediaType = contentType != null && !contentType.isBlank()
                    ? MediaType.parseMediaType(contentType)
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception ex) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        boolean inline = contentType != null && contentType.toLowerCase().startsWith("image/");
        String disposition = inline ? "inline" : "attachment";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header("Content-Disposition", disposition + "; filename=\"" + filename + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/chat/messages/{messageId}/file")
    public ResponseEntity<Resource> getChatAttachment(@PathVariable("id") Long id,
                                                      @PathVariable("messageId") Long messageId,
                                                      Authentication authentication) {
        var message = leadChatService.getChatAttachment(id, messageId, authentication.getName());
        String path = message.getAttachmentPath();
        if (path == null || path.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Attachment not found");
        }
        Resource resource = new org.springframework.core.io.FileSystemResource(path);
        if (!resource.exists() || !resource.isReadable()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Attachment not found");
        }

        String filename = message.getAttachmentName();
        if (filename == null || filename.isBlank()) {
            filename = "attachment";
        }
        filename = filename.replace("\"", "");

        String contentType = message.getAttachmentType();
        MediaType mediaType;
        try {
            mediaType = contentType != null && !contentType.isBlank()
                    ? MediaType.parseMediaType(contentType)
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception ex) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        boolean inline = contentType != null && contentType.toLowerCase().startsWith("image/");
        String disposition = inline ? "inline" : "attachment";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header("Content-Disposition", disposition + "; filename=\"" + filename + "\"")
                .body(resource);
    }
}
