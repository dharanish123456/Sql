package com.nexorcrm.backend.controller;

import com.nexorcrm.backend.dto.ApiMessageResponse;
import com.nexorcrm.backend.dto.StockRequestChatMessageRequest;
import com.nexorcrm.backend.dto.StockRequestChatMessageResponse;
import com.nexorcrm.backend.dto.StockRequestRequest;
import com.nexorcrm.backend.dto.StockRequestResponse;
import com.nexorcrm.backend.dto.StockRequestLogResponse;
import com.nexorcrm.backend.entity.StockRequestChatMessage;
import com.nexorcrm.backend.service.StockRequestChatService;
import com.nexorcrm.backend.service.StockRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/stock-requests")
public class StockRequestController {

    private final StockRequestService service;
    private final StockRequestChatService chatService;

    public StockRequestController(StockRequestService service,
                                  StockRequestChatService chatService) {
        this.service = service;
        this.chatService = chatService;
    }

    @GetMapping
    public List<StockRequestResponse> list(@RequestParam(required = false) Long requestedBy,
                                           @RequestParam(required = false) Long assignedTo,
                                           @RequestParam(required = false) String status,
                                           Authentication authentication) {
        String principal = authentication != null ? authentication.getName() : null;
        return service.list(principal, requestedBy, assignedTo, status);
    }

    @GetMapping("/{id}")
    public StockRequestResponse getById(@PathVariable Long id, Authentication authentication) {
        return service.getById(id);
    }

    @PostMapping
    public StockRequestResponse create(@Valid @RequestBody StockRequestRequest req,
                                        Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : null;
        return service.create(req, actor);
    }

    @PatchMapping("/{id}")
    public StockRequestResponse update(@PathVariable Long id,
                                        @RequestBody StockRequestRequest req,
                                        Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : null;
        return service.update(id, req, actor);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ApiMessageResponse delete(@PathVariable Long id, Authentication authentication) {
        service.delete(id);
        return new ApiMessageResponse("Stock request deleted");
    }

    // log retrieval
    @GetMapping("/{id}/log")
    public List<StockRequestLogResponse> getLog(@PathVariable Long id) {
        return service.getLogs(id).stream().map(this::toLogResponse).collect(java.util.stream.Collectors.toList());
    }

    private StockRequestLogResponse toLogResponse(com.nexorcrm.backend.entity.StockRequestLog log) {
        StockRequestLogResponse out = new StockRequestLogResponse();
        out.setId(log.getId());
        out.setAction(log.getAction());
        out.setActor(log.getActor());
        out.setCreatedAt(log.getCreatedAt());
        return out;
    }

    // chat endpoints
    @GetMapping("/{id}/chat/messages")
    public List<StockRequestChatMessageResponse> listChat(@PathVariable Long id,
                                                           Authentication authentication) {
        return chatService.listMessages(id, authentication.getName());
    }

    @PostMapping("/{id}/chat/messages")
    public StockRequestChatMessageResponse sendChat(@PathVariable Long id,
                                                    @Valid @RequestBody StockRequestChatMessageRequest req,
                                                    Authentication authentication) {
        return chatService.sendMessage(id, req, authentication.getName());
    }

    @PostMapping(value = "/{id}/chat/messages/file", consumes = {"multipart/form-data"})
    public StockRequestChatMessageResponse sendChatFile(@PathVariable Long id,
                                                        @RequestParam(value = "message", required = false) String message,
                                                        @RequestParam(value = "file", required = false) MultipartFile file,
                                                        Authentication authentication) {
        return chatService.sendMessageWithFile(id, message, file, authentication.getName());
    }

    @GetMapping("/{id}/chat/messages/{messageId}/file")
    public ResponseEntity<Resource> getChatAttachment(@PathVariable Long id,
                                                      @PathVariable Long messageId,
                                                      Authentication authentication) {
        StockRequestChatMessage msg = chatService.getChatAttachment(id, messageId, authentication.getName());
        String path = msg.getAttachmentPath();
        if (path == null || path.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Attachment not found");
        }
        Resource resource = new org.springframework.core.io.FileSystemResource(path);
        if (!resource.exists() || !resource.isReadable()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Attachment not found");
        }
        String filename = msg.getAttachmentName();
        if (filename == null || filename.isBlank()) {
            filename = "attachment";
        }
        filename = filename.replace("\"", "");
        String contentType = msg.getAttachmentType();
        org.springframework.http.MediaType mediaType;
        try {
            mediaType = contentType != null && !contentType.isBlank()
                    ? org.springframework.http.MediaType.parseMediaType(contentType)
                    : org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception ex) {
            mediaType = org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
        }
        boolean inline = contentType != null && contentType.toLowerCase().startsWith("image/");
        String disposition = inline ? "inline" : "attachment";
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header("Content-Disposition", disposition + "; filename=\"" + filename + "\"")
                .body(resource);
    }
}
