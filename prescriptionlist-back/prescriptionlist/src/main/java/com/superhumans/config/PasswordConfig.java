package com.superhumans.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Компонент конфігурації, що надає bean для кодування паролів.
 *
 * @Component означає, що клас є Spring-компонентом (біном) і автоматично буде виявлений компонент-скануванням.
 */
@Component
public class PasswordConfig {

    /**
     * Повертає інстанс {@link PasswordEncoder}, який використовує алгоритм BCrypt для хешування паролів.
     *
     * @return інтерфейс PasswordEncoder з реалізацією BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
