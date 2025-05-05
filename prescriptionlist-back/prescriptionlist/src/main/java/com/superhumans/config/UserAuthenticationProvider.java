package com.superhumans.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.superhumans.model.user.Role;
import com.superhumans.model.user.User;
import com.superhumans.service.impl.UserServiceImpl;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;

/**
 * Компонент для генерації та валідації JWT токенів.
 * Використовується у процесі аутентифікації користувачів.
 */
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAuthenticationProvider {

    @Value("${security.jwt.secret-key}")
    String secretKey;

    @Value("${security.jwt.expiration}")
    Integer expiration;

    final UserServiceImpl userService;

    /**
     * Ініціалізація закодованого секретного ключа після створення біну.
     * Секрет кодується у Base64 для безпечнішого зберігання в JVM.
     */
    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * Створює JWT токен для переданого користувача.
     *
     * @param user користувач, для якого створюється токен
     * @return створений JWT токен у вигляді рядка
     */
    public String createToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expiration);

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getLogin())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("userRole", String.valueOf(user.getUserRole()))
                .withClaim("businessRole", user.getBusinessRole())
                .withClaim("userRole", String.valueOf(user.getUserRole()))
                .sign(algorithm);
    }

    /**
     * Перевіряє дійсність токена та відновлює користувача на основі вбудованих claims.
     * (легка перевірка без доступу до БД).
     *
     * @param token JWT токен
     * @return об'єкт Authentication з відновленим користувачем
     */
    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);
        User user = User.builder()
                .login(decoded.getSubject())
                .firstName(decoded.getClaim("firstName").asString())
                .lastName(decoded.getClaim("lastName").asString())
                .middleName(decoded.getClaim("middleName").asString())
                .userRole(Role.valueOf(decoded.getClaim("userRole").asString()))
                .businessRole(decoded.getClaim("businessRole").asString())
                .build();
        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }

    /**
     * Перевіряє токен та додатково отримує користувача з БД для більш суворої перевірки.
     *
     * @param token JWT токен
     * @return об'єкт Authentication з повноцінним користувачем з БД
     */
    public Authentication validateTokenStrongly(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        User user = userService.findByLogin(decoded.getSubject());

        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }

}
