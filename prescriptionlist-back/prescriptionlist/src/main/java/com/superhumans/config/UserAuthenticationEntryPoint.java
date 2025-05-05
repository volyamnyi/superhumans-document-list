package com.superhumans.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Обробник точок входу для невдалої автентифікації.
 *
 * Викликається, коли неавторизований користувач намагається отримати доступ до захищеного ресурсу.
 * Повертає HTTP статус 401 (Unauthorized) та повідомлення про помилку у форматі JSON.
 */
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserAuthenticationEntryPoint implements AuthenticationEntryPoint {

    ObjectMapper objectMapper;

    /**
     * Обробляє невдалу автентифікацію та формує JSON-відповідь зі статусом 401.
     *
     * @param request        вхідний HTTP-запит
     * @param response       HTTP-відповідь
     * @param authException  виняток, пов'язаний з автентифікацією
     * @throws IOException у разі помилки введення/виведення
     * @throws ServletException у разі помилки сервлета
     */
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), new Error("Unauthorized path"));
    }
}
