package com.hrms.hr_payroll_management_system.security;

import com.hrms.hr_payroll_management_system.entity.RefreshToken;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    private static final String FRONTEND_CALLBACK_URL = "http://localhost:5173/oauth/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();

        // Wrap the User in CustomUserDetails so JwtService can read authorities/username
        CustomUserDetails userDetails = new CustomUserDetails(user);

        // Same claims shape as the normal login flow, so downstream token parsing is unchanged
        String accessToken = jwtService.generateToken(buildExtraClaims(user), userDetails);

        RefreshToken refreshToken = refreshTokenService.create(user);

        String redirectUrl = UriComponentsBuilder.fromUriString(FRONTEND_CALLBACK_URL)
                .queryParam("accessToken", URLEncoder.encode(accessToken, StandardCharsets.UTF_8))
                .queryParam("refreshToken", URLEncoder.encode(refreshToken.getToken(), StandardCharsets.UTF_8))
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private java.util.Map<String, Object> buildExtraClaims(User user) {
        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("userId", user.getId());
        claims.put("roles", user.getRoles().stream()
                .map(role -> "ROLE_" + role.getName())
                .collect(java.util.stream.Collectors.toSet()));
        return claims;
    }
}