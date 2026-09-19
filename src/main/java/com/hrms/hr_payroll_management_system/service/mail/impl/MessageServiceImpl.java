package com.hrms.hr_payroll_management_system.service.mail.impl;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.mail.SendMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.MessageResponse;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.mail.Message;

import com.hrms.hr_payroll_management_system.exception.BadRequestException;
import com.hrms.hr_payroll_management_system.exception.ResourceNotFoundException;
import com.hrms.hr_payroll_management_system.exception.UnauthorizedException;

import com.hrms.hr_payroll_management_system.repository.EmployeeRepository;
import com.hrms.hr_payroll_management_system.repository.mail.MessageRepository;

import com.hrms.hr_payroll_management_system.service.mail.MessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrms.hr_payroll_management_system.dto.response.mail.AttachmentResponse;
import com.hrms.hr_payroll_management_system.dto.response.mail.ThreadSummaryResponse;
import com.hrms.hr_payroll_management_system.entity.mail.MessageAttachment;
import com.hrms.hr_payroll_management_system.repository.mail.MessageAttachmentRepository;

import org.springframework.beans.factory.annotation.Value;
import com.hrms.hr_payroll_management_system.websocket.MailWebSocketHandler;
import org.springframework.web.multipart.MultipartFile;
import com.hrms.hr_payroll_management_system.dto.request.mail.BroadcastMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.BroadcastResponse;
import com.hrms.hr_payroll_management_system.enums.EmployeeStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final EmployeeRepository employeeRepository;
    private final MessageAttachmentRepository messageAttachmentRepository;
    private final MailWebSocketHandler mailSocketHandler;

    @Override
    public MessageResponse send(String senderEmail, SendMessageRequest request) {

        Employee sender = getEmployeeByEmail(senderEmail);

        Employee recipient = employeeRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found."));

        if (sender.getId().equals(recipient.getId())) {
            throw new BadRequestException("You cannot send a message to yourself.");
        }

        Message parent = null;
        if (request.getParentMessageId() != null) {
            parent = messageRepository.findById(request.getParentMessageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Original message not found."));
        }
        


        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .subject(request.getSubject())
                .body(request.getBody())
                .read(false)
                .parentMessage(parent)
                .deletedBySender(false)
                .deletedByRecipient(false)
                .build();

        
        Message saved = messageRepository.save(message);

        saved.setThreadId(
                parent != null
                        ? (parent.getThreadId() != null ? parent.getThreadId() : parent.getId())
                        : saved.getId()
        );
        saved = messageRepository.save(saved);
        mailSocketHandler.sendToEmployee(saved.getRecipient().getEmail(), "NEW_MESSAGE", map(saved));

        return map(saved);

    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> getInbox(String email, int page, int size) {
        Employee self = getEmployeeByEmail(email);

        Page<Message> result = messageRepository
                .findByRecipientIdAndDeletedByRecipientFalseOrderByCreatedAtDesc(
                        self.getId(), PageRequest.of(page, size));

        return toPageResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> getSent(String email, int page, int size) {
        Employee self = getEmployeeByEmail(email);

        Page<Message> result = messageRepository
                .findBySenderIdAndDeletedBySenderFalseOrderByCreatedAtDesc(
                        self.getId(), PageRequest.of(page, size));

        return toPageResponse(result);
    }

    @Override
    public MessageResponse getById(Long id, String email) {
        Employee self = getEmployeeByEmail(email);
        Message message = getMessage(id);

        boolean isRecipient = message.getRecipient().getId().equals(self.getId());
        boolean isSender = message.getSender().getId().equals(self.getId());

        if (!isRecipient && !isSender) {
            throw new UnauthorizedException("You do not have access to this message.");
        }

        if (isRecipient && !message.getRead()) {
            message.setRead(true);
            messageRepository.save(message);
        }

        return map(message);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread(String email) {
        Employee self = getEmployeeByEmail(email);
        return messageRepository.countByRecipientIdAndReadFalseAndDeletedByRecipientFalse(self.getId());
    }

    @Override
    public void delete(Long id, String email) {
        Employee self = getEmployeeByEmail(email);
        Message message = getMessage(id);

        boolean isRecipient = message.getRecipient().getId().equals(self.getId());
        boolean isSender = message.getSender().getId().equals(self.getId());

        if (!isRecipient && !isSender) {
            throw new UnauthorizedException("You do not have access to this message.");
        }

        if (isRecipient) message.setDeletedByRecipient(true);
        if (isSender) message.setDeletedBySender(true);

        // Hard-delete only once both sides have removed it, so neither side's
        // copy disappears out from under the other.
        if (message.getDeletedBySender() && message.getDeletedByRecipient()) {
            messageRepository.delete(message);
        } else {
            messageRepository.save(message);
        }
    }

    private Message getMessage(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found."));
    }

    private Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee record linked to this account."));
    }

    private PageResponse<MessageResponse> toPageResponse(Page<Message> result) {
        return PageResponse.<MessageResponse>builder()
                .content(result.map(this::map).getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    
    @Value("${app.upload.attachments-dir}")
    private String attachmentsDir;

    private static final List<String> ALLOWED_ATTACHMENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain", "application/zip"
    );
    private static final long MAX_ATTACHMENT_BYTES = 10L * 1024 * 1024; // 10MB
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ThreadSummaryResponse> getThreads(String email, int page, int size) {
        Employee self = getEmployeeByEmail(email);

        Page<Message> latest = messageRepository
                .findLatestPerThreadForEmployee(self.getId(), PageRequest.of(page, size));

        List<ThreadSummaryResponse> content = latest.getContent().stream()
                .map(m -> {
                    boolean iAmSender = m.getSender().getId().equals(self.getId());
                    Employee other = iAmSender ? m.getRecipient() : m.getSender();

                    long unread = messageRepository.countByThreadIdAndRecipientIdAndReadFalseAndDeletedByRecipientFalse(
                            m.getThreadId(), self.getId());

                    return ThreadSummaryResponse.builder()
                            .threadId(m.getThreadId())
                            .subject(m.getSubject())
                            .lastMessageSnippet(
                                    m.getBody().length() > 120 ? m.getBody().substring(0, 120) + "…" : m.getBody())
                            .lastMessageAt(m.getCreatedAt())
                            .otherParticipantId(other.getId())
                            .otherParticipantName(other.getFirstName() + " " + other.getLastName())
                            .otherParticipantPhotoUrl(other.getPhotoUrl())
                            .unreadCount(unread)
                            .hasAttachments(!m.getAttachments().isEmpty())
                            .build();
                })
                .toList();

        return PageResponse.<ThreadSummaryResponse>builder()
                .content(content)
                .page(latest.getNumber())
                .size(latest.getSize())
                .totalElements(latest.getTotalElements())
                .totalPages(latest.getTotalPages())
                .first(latest.isFirst())
                .last(latest.isLast())
                .build();
    }

    @Override
    public List<MessageResponse> getThread(Long threadId, String email) {
        Employee self = getEmployeeByEmail(email);

        List<Message> messages = messageRepository.findByThreadIdOrderByCreatedAtAsc(threadId);

        if (messages.isEmpty()) {
            throw new ResourceNotFoundException("Conversation not found.");
        }

        Message first = messages.get(0);
        boolean participant = first.getSender().getId().equals(self.getId())
                || first.getRecipient().getId().equals(self.getId());

        if (!participant) {
            throw new UnauthorizedException("You do not have access to this conversation.");
        }

        // mark every unread message where I'm the recipient as read
        messages.stream()
                .filter(m -> m.getRecipient().getId().equals(self.getId()) && !m.getRead())
                .forEach(m -> m.setRead(true));
        messageRepository.saveAll(messages);

        return messages.stream().map(this::map).toList();
    }

    @Override
    public AttachmentResponse addAttachment(Long messageId, String email, MultipartFile file) {
        Employee self = getEmployeeByEmail(email);
        Message message = getMessage(messageId);

        if (!message.getSender().getId().equals(self.getId())) {
            throw new UnauthorizedException("Only the sender can attach files to this message.");
        }
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded.");
        }
        if (file.getSize() > MAX_ATTACHMENT_BYTES) {
            throw new BadRequestException("Attachment must be 10MB or smaller.");
        }
        if (!ALLOWED_ATTACHMENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("This file type is not allowed.");
        }

        try {
            Path dir = Paths.get(attachmentsDir);
            Files.createDirectories(dir);

            String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
            String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String storedName = "msg-" + messageId + "-" + UUID.randomUUID() + ext;
            Path target = dir.resolve(storedName);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            MessageAttachment attachment = MessageAttachment.builder()
                    .message(message)
                    .fileName(original)
                    .fileUrl("/uploads/attachments/" + storedName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();

            attachment = messageAttachmentRepository.save(attachment);

            return AttachmentResponse.builder()
                    .id(attachment.getId())
                    .fileName(attachment.getFileName())
                    .fileUrl(attachment.getFileUrl())
                    .contentType(attachment.getContentType())
                    .fileSize(attachment.getFileSize())
                    .build();

        } catch (IOException e) {
            throw new BadRequestException("Failed to save the uploaded file.");
        }
    }

    @Override
    public void removeAttachment(Long messageId, Long attachmentId, String email) {
        Employee self = getEmployeeByEmail(email);
        Message message = getMessage(messageId);

        if (!message.getSender().getId().equals(self.getId())) {
            throw new UnauthorizedException("Only the sender can remove attachments from this message.");
        }

        MessageAttachment attachment = messageAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found."));

        if (!attachment.getMessage().getId().equals(messageId)) {
            throw new BadRequestException("Attachment does not belong to this message.");
        }

        try {
            Files.deleteIfExists(Paths.get(".", attachment.getFileUrl()));
        } catch (IOException ignored) {
            // file already gone — proceed with removing the DB record regardless
        }

        messageAttachmentRepository.delete(attachment);
    }
    private MessageResponse map(Message m) {
    Employee sender = m.getSender();
        Employee recipient = m.getRecipient();

        List<AttachmentResponse> attachments = m.getAttachments().stream()
                .map(a -> AttachmentResponse.builder()
                        .id(a.getId())
                        .fileName(a.getFileName())
                        .fileUrl(a.getFileUrl())
                        .contentType(a.getContentType())
                        .fileSize(a.getFileSize())
                        .build())
                .toList();

        return MessageResponse.builder()
                .id(m.getId())
                .senderId(sender.getId())
                .senderName(sender.getFirstName() + " " + sender.getLastName())
                .senderPhotoUrl(sender.getPhotoUrl())
                .recipientId(recipient.getId())
                .recipientName(recipient.getFirstName() + " " + recipient.getLastName())
                .recipientPhotoUrl(recipient.getPhotoUrl())
                .subject(m.getSubject())
                .body(m.getBody())
                .read(m.getRead())
                .parentMessageId(m.getParentMessage() != null ? m.getParentMessage().getId() : null)
                .createdAt(m.getCreatedAt())
                .attachments(attachments)
                .build();
    }
    @Override
public BroadcastResponse sendBroadcast(String senderEmail, BroadcastMessageRequest request) {
    Employee sender = getEmployeeByEmail(senderEmail);

    List<Employee> recipients = switch (request.getTargetType()) {
        case EMPLOYEE_LIST -> {
            if (request.getRecipientIds() == null || request.getRecipientIds().isEmpty()) {
                throw new BadRequestException("Select at least one recipient.");
            }
            yield employeeRepository.findAllById(request.getRecipientIds());
        }
        case DEPARTMENT -> {
            requireTargetId(request);
            yield employeeRepository.findByDepartmentId(request.getTargetId());
        }
        case BRANCH -> {
            requireTargetId(request);
            yield employeeRepository.findByBranchId(request.getTargetId());
        }
        case COMPANY -> {
            requireTargetId(request);
            yield employeeRepository.findByCompanyId(request.getTargetId());
        }
        case ALL -> employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
    };

    recipients = recipients.stream()
            .filter(e -> !e.getId().equals(sender.getId()))
            .toList();

    if (recipients.isEmpty()) {
        throw new BadRequestException("No recipients matched this broadcast target.");
    }

    String broadcastId = UUID.randomUUID().toString();

    List<Message> messages = recipients.stream()
            .map(recipient -> Message.builder()
                    .sender(sender)
                    .recipient(recipient)
                    .subject(request.getSubject())
                    .body(request.getBody())
                    .read(false)
                    .deletedBySender(false)
                    .deletedByRecipient(false)
                    .broadcastId(broadcastId)
                    .build())
            .toList();

    List<Message> saved = messageRepository.saveAll(messages);
    saved.forEach(m -> m.setThreadId(m.getId()));
    saved = messageRepository.saveAll(saved);

    // live-push to every online recipient
    for (Message m : saved) {
        mailSocketHandler.sendToEmployee(m.getRecipient().getEmail(), "NEW_MESSAGE", map(m));
    }

    return BroadcastResponse.builder()
            .broadcastId(broadcastId)
            .recipientCount(saved.size())
            .subject(request.getSubject())
            .build();
}

private void requireTargetId(BroadcastMessageRequest request) {
    if (request.getTargetId() == null) {
        throw new BadRequestException("A target department/branch/company is required.");
    }
}
}