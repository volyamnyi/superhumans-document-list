package com.superhumans.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Фільтр для авторизації запитів з JWT токеном.
 */
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtAuthFilter extends OncePerRequestFilter {

    UserAuthenticationProvider userAuthenticationProvider;

    /**
     * Обробляє HTTP-запити для перевірки наявності токена авторизації у заголовку.
     * Якщо токен валідний — встановлює автентифікацію у контексті безпеки Spring Security.
     * Для запитів GET викликається слабка перевірка токена, для інших — сувора.
     *
     * @param request  HTTP-запит, який обробляється фільтром
     * @param response HTTP-відповідь, що повертається клієнту
     * @param filterChain Ланцюг фільтрів, у який потрібно передати керування після обробки
     * @throws ServletException якщо виникає помилка на рівні сервлета
     * @throws IOException якщо виникає помилка вводу/виводу
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null) {
            String[] authElements = header.split(" ");

            if (authElements.length == 2
                    && "Bearer".equals(authElements[0])) {
                try {
                    if ("GET".equals(request.getMethod())) {
                        SecurityContextHolder.getContext().setAuthentication(
                                userAuthenticationProvider.validateToken(authElements[1]));
                    } else {
                        SecurityContextHolder.getContext().setAuthentication(
                                userAuthenticationProvider.validateTokenStrongly(authElements[1]));
                    }
                } catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                    throw e;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
