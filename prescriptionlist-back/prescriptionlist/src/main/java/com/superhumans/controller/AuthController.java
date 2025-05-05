package com.superhumans.controller;


import com.superhumans.config.UserAuthenticationProvider;
import com.superhumans.model.user.Credentials;
import com.superhumans.model.user.SignUp;
import com.superhumans.model.user.User;
import com.superhumans.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


/**
 * Контролер для аутентифікації та керування користувачами.
 * Забезпечує можливість входу користувача, реєстрації, отримання та оновлення даних користувачів.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173","http://192.168.24.32:5173"}, allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.GET})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    /**
     * Сервіс для роботи з користувачами.
     */
    UserService userService;

    /**
     * Провайдер для створення та перевірки JWT токенів.
     */
    UserAuthenticationProvider userAuthenticationProvider;

    /**
     * Виконує вхід користувача в систему, перевіряючи облікові дані.
     *
     * @param credentials Об'єкт, що містить логін та пароль користувача.
     * @return ResponseEntity з інформацією про користувача та токеном.
     */
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid Credentials credentials) {
        User user = userService.login(credentials);
        user.setToken(userAuthenticationProvider.createToken(user));
        user.setPassword(null);
        //user.setUserRole(null);
        return ResponseEntity.ok(user);
    }

    /**
     * Реєструє нового користувача адміністратора.
     *
     * @param user Об'єкт, що містить дані користувача для реєстрації.
     * @return ResponseEntity з новоствореним користувачем та його токеном.
     */
    @PostMapping("/admin/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<User> register(@RequestBody @Valid SignUp user) {
        User createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(createdUser));
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }

    /**
     * Отримує список всіх користувачів.
     *
     * @return Список всіх користувачів.
     */
    @GetMapping("/admin")
    @ResponseStatus(HttpStatus.OK)
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Оновлює інформацію про існуючого користувача.
     *
     * @param userDto Об'єкт, що містить оновлені дані користувача.
     * @return Оновленого користувача.
     */
    @PutMapping("/admin")
    @ResponseStatus(HttpStatus.OK)
    public User updateUserById(@RequestBody @Valid SignUp userDto) {
        return userService.updateUserById(userDto);
    }

    /**
     * Видаляє користувача за його ID.
     *
     * @param id ID користувача, якого необхідно видалити.
     */
    @DeleteMapping("/admin/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUserById(@PathVariable Integer id) {
        userService.deleteUserById(id);
    }

}
