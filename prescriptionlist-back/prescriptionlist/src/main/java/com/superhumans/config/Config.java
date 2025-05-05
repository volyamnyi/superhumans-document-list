package com.superhumans.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Конфігураційний клас Spring для налаштування додаткових бінів.
 */
@Configuration
public class Config {

    /**
     * @return {@link ObjectMapper} із підключеним модулем {@link JavaTimeModule}
     * для коректної роботи з типами LocalDate, LocalDateTime тощо.
     */
    @Bean
    public ObjectMapper getObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
