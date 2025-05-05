package com.superhumans.config;

import com.superhumans.exception.AppException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Глобальний обробник винятків для REST API.
 *
 * @ControllerAdvice дозволяє централізовано обробляти виключення, що виникають у контролерах.
 */
@ControllerAdvice
public class RestExceptionHandler {

    /**
     * Обробляє виключення типу {@link AppException} і повертає відповідь з помилкою у форматі JSON.
     *
     * @param ex екземпляр AppException, що містить повідомлення про помилку та HTTP-статус
     * @return ResponseEntity з об’єктом Error і відповідним HTTP-статусом
     */
    @ExceptionHandler(value = { AppException.class })
    @ResponseBody
    public ResponseEntity<Error> handleException(AppException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(new Error(ex.getMessage()));
    }
}