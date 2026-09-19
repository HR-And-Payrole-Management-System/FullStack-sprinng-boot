package com.hrms.hr_payroll_management_system.repository.mail;

import com.hrms.hr_payroll_management_system.entity.mail.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;  

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByRecipientIdAndDeletedByRecipientFalseOrderByCreatedAtDesc(
            Long recipientId, Pageable pageable);

    Page<Message> findBySenderIdAndDeletedBySenderFalseOrderByCreatedAtDesc(
            Long senderId, Pageable pageable);

    long countByRecipientIdAndReadFalseAndDeletedByRecipientFalse(Long recipientId);


        List<Message> findByThreadIdOrderByCreatedAtAsc(Long threadId);

        long countByThreadIdAndRecipientIdAndReadFalseAndDeletedByRecipientFalse(Long threadId, Long employeeId);

        // Latest message per thread the employee participates in — powers the conversation list
        @Query("""
        SELECT m FROM Message m
        WHERE m.id IN (
                SELECT MAX(m2.id) FROM Message m2
                WHERE (m2.sender.id = :employeeId AND m2.deletedBySender = false)
                OR (m2.recipient.id = :employeeId AND m2.deletedByRecipient = false)
                GROUP BY m2.threadId
        )
        ORDER BY m.createdAt DESC
        """)
        Page<Message> findLatestPerThreadForEmployee(@Param("employeeId") Long employeeId, Pageable pageable);
}