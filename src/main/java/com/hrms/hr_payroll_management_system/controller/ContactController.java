package com.hrms.hr_payroll_management_system.controller;

import com.hrms.hr_payroll_management_system.dto.request.contact.ContactRequest;
import com.hrms.hr_payroll_management_system.service.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final MailService mailService;

    @PostMapping
    public ResponseEntity<Void> submitContactForm(
            @Valid @RequestBody ContactRequest request
    ) {
        mailService.sendContactFormEmail(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );

        return ResponseEntity.ok().build();
    }
}