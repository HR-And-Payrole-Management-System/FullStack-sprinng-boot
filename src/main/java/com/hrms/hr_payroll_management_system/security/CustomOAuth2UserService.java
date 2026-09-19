package com.hrms.hr_payroll_management_system.security;

import com.hrms.hr_payroll_management_system.entity.Role;
import com.hrms.hr_payroll_management_system.entity.User;
import com.hrms.hr_payroll_management_system.enums.AuthProvider;
import com.hrms.hr_payroll_management_system.enums.Status;
import com.hrms.hr_payroll_management_system.repository.RoleRepository;
import com.hrms.hr_payroll_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google" or "github"
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = extractEmail(registrationId, attributes, userRequest.getAccessToken().getTokenValue());
        if (email == null) {
            throw new OAuth2AuthenticationException("Email not available from " + registrationId);
        }

        String firstName = extractFirstName(registrationId, attributes);
        String lastName = extractLastName(registrationId, attributes);
        String providerId = String.valueOf(attributes.get(registrationId.equals("github") ? "id" : "sub"));
        AuthProvider provider = registrationId.equals("github") ? AuthProvider.GITHUB : AuthProvider.GOOGLE;

        User user = userRepository.findByEmail(email)
                .map(existing -> {
                    // Link existing local account to this provider if not already linked
                    if (existing.getProvider() == AuthProvider.LOCAL) {
                        existing.setProvider(provider);
                        existing.setProviderId(providerId);
                    }
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    Role defaultRole = roleRepository.findByName("EMPLOYEE")
                            .orElseThrow(() -> new OAuth2AuthenticationException("Default role EMPLOYEE not found"));

                    User newUser = User.builder()
                            .email(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .password(null)
                            .provider(provider)
                            .providerId(providerId)
                            .emailVerified(true)   // Google/GitHub already verified the email
                            .enabled(true)
                            .status(Status.ACTIVE)
                            .roles(new HashSet<>(Set.of(defaultRole)))
                            .build();

                    return userRepository.save(newUser);
                });

        // Force-load roles now, while the Hibernate session (from @Transactional) is still open.
        // Without this, CustomOAuth2User.getAuthorities() throws LazyInitializationException later,
        // because it is called by Spring Security's OAuth2LoginAuthenticationProvider AFTER this
        // method (and its transaction/session) has already finished.
        user.getRoles().size();

        return new CustomOAuth2User(user, attributes);
    }

    private String extractEmail(String registrationId, Map<String, Object> attributes, String accessToken) {

        Object email = attributes.get("email");
        if (email != null) {
            return email.toString();
        }

        // GitHub only puts "email" in the /user response if the user made it public.
        // If it's private, we have to call /user/emails separately with the access token.
        if (registrationId.equals("github")) {
            return fetchGithubPrimaryEmail(accessToken);
        }

        return null;
    }

    private String fetchGithubPrimaryEmail(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/vnd.github+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> emails = response.getBody();
            if (emails == null) {
                return null;
            }

            return emails.stream()
                    .filter(e -> Boolean.TRUE.equals(e.get("primary")))
                    .map(e -> (String) e.get("email"))
                    .findFirst()
                    .orElseGet(() -> emails.isEmpty() ? null : (String) emails.get(0).get("email"));

        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(
                    "Failed to fetch GitHub email: " + ex.getMessage()
            );
        }
    }

    private String extractFirstName(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equals("github")) {
            String name = (String) attributes.get("name");
            return name != null && !name.isBlank() ? name.split(" ")[0] : (String) attributes.get("login");
        }
        String givenName = (String) attributes.get("given_name");
        return givenName != null ? givenName : "";
    }

    private String extractLastName(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equals("github")) {
            String name = (String) attributes.get("name");
            String[] parts = (name != null && !name.isBlank()) ? name.split(" ") : new String[0];
            return parts.length > 1 ? parts[parts.length - 1] : "";
        }
        String familyName = (String) attributes.get("family_name");
        return familyName != null ? familyName : "";
    }
}