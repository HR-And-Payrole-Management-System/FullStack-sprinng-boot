package com.hrms.hr_payroll_management_system.config;

import com.hrms.hr_payroll_management_system.websocket.MailWebSocketHandler;
import com.hrms.hr_payroll_management_system.websocket.WebSocketAuthInterceptor;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final MailWebSocketHandler mailWebSocketHandler;
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(mailWebSocketHandler, "/ws/mail")
                .addInterceptors(webSocketAuthInterceptor)
                .setAllowedOriginPatterns("*"); // tighten to your real frontend origin in production
    }
}