package com.hrms.hr_payroll_management_system.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MailWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, Set<WebSocketSession>> sessionsByEmail = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String email = (String) session.getAttributes().get("email");
        if (email != null) {
            sessionsByEmail
                    .computeIfAbsent(email, k -> ConcurrentHashMap.newKeySet())
                    .add(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String email = (String) session.getAttributes().get("email");
        if (email == null) return;

        Set<WebSocketSession> sessions = sessionsByEmail.get(email);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) sessionsByEmail.remove(email);
        }
    }

    public void sendToEmployee(String email, String type, Object payload) {
        Set<WebSocketSession> sessions = sessionsByEmail.get(email);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(Map.of("type", type, "data", payload));
            TextMessage message = new TextMessage(json);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    synchronized (session) {
                        session.sendMessage(message);
                    }
                }
            }
        } catch (IOException ignored) {
            // best-effort push; the client will still see the update on next page load
        }
    }
}