package com.superhumans.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.superhumans.model.user.Permission.*;
import static org.springframework.http.HttpMethod.*;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {

    UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    UserAuthenticationProvider userAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint(userAuthenticationEntryPoint))
                .addFilterBefore(new JwtAuthFilter(userAuthenticationProvider), UsernamePasswordAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").hasAnyAuthority(ADMIN_CREATE.getPermission())
                        .requestMatchers(GET, "/api/medicinelist/**").hasAnyAuthority(EMPLOYEE_READ.getPermission(), ADMIN_READ.getPermission())
                        .requestMatchers(POST, "/api/medicinelist/**").hasAnyAuthority(EMPLOYEE_CREATE.getPermission(), ADMIN_CREATE.getPermission())
                        .requestMatchers(PUT, "/api/medicinelist/**").hasAnyAuthority(EMPLOYEE_UPDATE.getPermission(), ADMIN_UPDATE.getPermission())
                        .requestMatchers(DELETE, "/api/medicinelist/**").hasAnyAuthority(EMPLOYEE_DELETE.getPermission(), ADMIN_DELETE.getPermission())

                        .requestMatchers(GET, "/api/**").hasAnyAuthority(ADMIN_READ.getPermission())
                        .requestMatchers(POST, "/api/**").hasAnyAuthority(ADMIN_CREATE.getPermission())
                        .requestMatchers(PUT, "/api/**").hasAnyAuthority(ADMIN_UPDATE.getPermission())
                        .requestMatchers(DELETE, "/api/**").hasAnyAuthority(ADMIN_DELETE.getPermission())
                        .anyRequest().authenticated())
        ;
        return http.build();
    }
}
