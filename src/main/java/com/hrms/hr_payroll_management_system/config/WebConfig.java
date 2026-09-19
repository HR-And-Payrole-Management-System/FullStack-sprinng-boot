package com.hrms.hr_payroll_management_system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.attachments-dir}")
    private String attachmentsDir;
    @Value("${app.upload.documents-dir}")
        private String documentsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String photosAbsolutePath = Path.of(uploadDir)
                .toAbsolutePath()
                .toUri()
                .toString();

        registry.addResourceHandler("/uploads/photos/**")
                .addResourceLocations(photosAbsolutePath);

        String attachmentsAbsolutePath = Path.of(attachmentsDir)
                .toAbsolutePath()
                .toUri()
                .toString();

        registry.addResourceHandler("/uploads/attachments/**")
                .addResourceLocations(attachmentsAbsolutePath);

        String documentsAbsolutePath = Path.of(documentsDir).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/documents/**")
                .addResourceLocations(documentsAbsolutePath);
    }
}