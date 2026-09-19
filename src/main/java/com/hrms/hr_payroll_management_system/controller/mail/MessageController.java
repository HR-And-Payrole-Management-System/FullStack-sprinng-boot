package com.hrms.hr_payroll_management_system.controller.mail;

import com.hrms.hr_payroll_management_system.common.response.ApiResponse;
import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;

import com.hrms.hr_payroll_management_system.dto.request.mail.SendMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.MessageResponse;

import com.hrms.hr_payroll_management_system.service.mail.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.hrms.hr_payroll_management_system.dto.response.mail.AttachmentResponse;
import com.hrms.hr_payroll_management_system.dto.response.mail.ThreadSummaryResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import com.hrms.hr_payroll_management_system.dto.request.mail.BroadcastMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.BroadcastResponse;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_SEND')")
    public ResponseEntity<ApiResponse<MessageResponse>> send(
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication
    ) {
        MessageResponse response = messageService.send(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<MessageResponse>builder()
                        .success(true)
                        .message("Message sent successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/inbox")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> inbox(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<MessageResponse>>builder()
                        .success(true)
                        .message("Inbox retrieved successfully.")
                        .data(messageService.getInbox(authentication.getName(), page, size))
                        .build()
        );
    }

    @GetMapping("/sent")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> sent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<MessageResponse>>builder()
                        .success(true)
                        .message("Sent messages retrieved successfully.")
                        .data(messageService.getSent(authentication.getName(), page, size))
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
    public ResponseEntity<ApiResponse<MessageResponse>> getById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ApiResponse.<MessageResponse>builder()
                        .success(true)
                        .message("Message retrieved successfully.")
                        .data(messageService.getById(id, authentication.getName()))
                        .build()
        );
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
    public ResponseEntity<ApiResponse<Long>> unreadCount(Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.<Long>builder()
                        .success(true)
                        .message("Unread count retrieved.")
                        .data(messageService.countUnread(authentication.getName()))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_DELETE')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        messageService.delete(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/threads")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
        public ResponseEntity<ApiResponse<PageResponse<ThreadSummaryResponse>>> threads(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                Authentication authentication
        ) {
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ThreadSummaryResponse>>builder()
                        .success(true)
                        .message("Conversations retrieved successfully.")
                        .data(messageService.getThreads(authentication.getName(), page, size))
                        .build()
        );
        }

        @GetMapping("/threads/{threadId}")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_VIEW')")
        public ResponseEntity<ApiResponse<List<MessageResponse>>> threadMessages(
                @PathVariable Long threadId,
                Authentication authentication
        ) {
        return ResponseEntity.ok(
                ApiResponse.<List<MessageResponse>>builder()
                        .success(true)
                        .message("Conversation retrieved successfully.")
                        .data(messageService.getThread(threadId, authentication.getName()))
                        .build()
        );
        }

        @PostMapping("/{id}/attachments")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_SEND')")
        public ResponseEntity<ApiResponse<AttachmentResponse>> addAttachment(
                @PathVariable Long id,
                @RequestParam("file") MultipartFile file,
                Authentication authentication
        ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AttachmentResponse>builder()
                        .success(true)
                        .message("Attachment uploaded successfully.")
                        .data(messageService.addAttachment(id, authentication.getName(), file))
                        .build()
        );
        }

        @DeleteMapping("/{id}/attachments/{attachmentId}")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_SEND')")
        public ResponseEntity<Void> removeAttachment(
                @PathVariable Long id,
                @PathVariable Long attachmentId,
                Authentication authentication
        ) {
        messageService.removeAttachment(id, attachmentId, authentication.getName());
        return ResponseEntity.noContent().build();
        }
        @PostMapping("/broadcast")
        @PreAuthorize("hasRole('ADMIN') or hasAuthority('MESSAGE_BROADCAST')")
        public ResponseEntity<ApiResponse<BroadcastResponse>> broadcast(
                @Valid @RequestBody BroadcastMessageRequest request,
                Authentication authentication
        ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<BroadcastResponse>builder()
                        .success(true)
                        .message("Broadcast sent successfully.")
                        .data(messageService.sendBroadcast(authentication.getName(), request))
                        .build()
        );
        }
}