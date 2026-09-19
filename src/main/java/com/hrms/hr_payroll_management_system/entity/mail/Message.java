package com.hrms.hr_payroll_management_system.entity.mail;

import com.hrms.hr_payroll_management_system.entity.Employee;
import com.hrms.hr_payroll_management_system.entity.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "messages",
        indexes = {
                @Index(name = "idx_message_recipient", columnList = "recipient_id"),
                @Index(name = "idx_message_sender", columnList = "sender_id"),
                // in @Table indexes:
                @Index(name = "idx_message_broadcast", columnList = "broadcast_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private Employee sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Employee recipient;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, length = 4000)
    private String body;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean read = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_message_id")
    private Message parentMessage;

    @Column(name = "deleted_by_sender", nullable = false)
    @Builder.Default
    private Boolean deletedBySender = false;

    @Column(name = "deleted_by_recipient", nullable = false)
    @Builder.Default
    private Boolean deletedByRecipient = false;

    @Column(name = "thread_id")
        private Long threadId;

        @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @Builder.Default
        private List<MessageAttachment> attachments = new ArrayList<>();

   @Column(name = "broadcast_id", length = 36)
        private String broadcastId;
}