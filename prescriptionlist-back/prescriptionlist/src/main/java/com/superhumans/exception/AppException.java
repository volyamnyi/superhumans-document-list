package com.superhumans.exception;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

/**
 * Клас {@code AppException} — це спеціалізоване виключення, яке використовується
 * для обробки помилок у додатку з додатковим HTTP статусом.
 *
 * <p>Наслідується від {@link RuntimeException} і дозволяє передавати
 * як повідомлення про помилку, так і HTTP статус для гнучкої обробки винятків
 * у REST API.</p>
 */
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppException extends RuntimeException {

    /**
     * HTTP статус, який описує тип помилки.
     */
    HttpStatus status;

    /**
     * Створює новий екземпляр {@code AppException} з вказаним повідомленням
     * і HTTP статусом.
     *
     * @param message текст повідомлення про помилку
     * @param status  HTTP статус, який слід повернути клієнту
     */
    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    /**
     * Повертає HTTP статус, пов’язаний із цим винятком.
     *
     * @return {@link HttpStatus}
     */
    public HttpStatus getStatus() {
        return status;
    }
}
