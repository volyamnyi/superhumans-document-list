package com.superhumans.config;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;

/**
 * Конфігураційний клас Spring для налаштування CORS (Cross-Origin Resource Sharing).
 * Дозволяє фронтенду, який працює на інших доменах (localhost:5173, 192.168.24.32:5173),
 * виконувати запити до бекенду.
 */
@Configuration
@EnableWebMvc
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebConfig {

    /**
     * Максимальний час (в секундах), на який можна кешувати CORS-налаштування.
     */
    long MAX_AGE = 3600L;

    /**
     * Порядок фільтрації CORS (фільтр буде виконаний раніше за стандартні фільтри Spring Security).
     */
    int CORS_FILTER_ORDER = -102;

    /**
     * Реєструє CORS-фільтр для обробки міждоменних запитів з дозволених джерел.
     *
     * @return об'єкт FilterRegistrationBean з налаштуванням CorsFilter
     */
    @Bean
    public FilterRegistrationBean corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://192.168.24.32:5173");
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT));
        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name()));
        config.setMaxAge(MAX_AGE);
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));

        bean.setOrder(CORS_FILTER_ORDER);
        return bean;
    }
}
