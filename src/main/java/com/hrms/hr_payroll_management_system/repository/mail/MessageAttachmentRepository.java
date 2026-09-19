package com.hrms.hr_payroll_management_system.repository.mail;

import com.hrms.hr_payroll_management_system.entity.mail.MessageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageAttachmentRepository extends JpaRepository<MessageAttachment, Long> {
}