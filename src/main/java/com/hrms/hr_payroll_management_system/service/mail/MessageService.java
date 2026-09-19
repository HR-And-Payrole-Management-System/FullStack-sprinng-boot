package com.hrms.hr_payroll_management_system.service.mail;

import com.hrms.hr_payroll_management_system.common.pagination.PageResponse;
import com.hrms.hr_payroll_management_system.dto.request.mail.SendMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.MessageResponse;
import com.hrms.hr_payroll_management_system.dto.response.mail.AttachmentResponse;
import com.hrms.hr_payroll_management_system.dto.response.mail.ThreadSummaryResponse;
import org.springframework.web.multipart.MultipartFile;
import com.hrms.hr_payroll_management_system.dto.request.mail.BroadcastMessageRequest;
import com.hrms.hr_payroll_management_system.dto.response.mail.BroadcastResponse;
import java.util.List;

public interface MessageService {

    MessageResponse send(String senderEmail, SendMessageRequest request);

    PageResponse<MessageResponse> getInbox(String email, int page, int size);

    PageResponse<MessageResponse> getSent(String email, int page, int size);

    MessageResponse getById(Long id, String email);

    long countUnread(String email);

    void delete(Long id, String email);

    PageResponse<ThreadSummaryResponse> getThreads(String email, int page, int size);

    List<MessageResponse> getThread(Long threadId, String email);

    AttachmentResponse addAttachment(Long messageId, String email, MultipartFile file);

    void removeAttachment(Long messageId, Long attachmentId, String email);

    BroadcastResponse sendBroadcast(String senderEmail, BroadcastMessageRequest request);
}