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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.GET})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

   UserService userService;
   UserAuthenticationProvider userAuthenticationProvider;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid Credentials credentials) {
        User user = userService.login(credentials);
        user.setToken(userAuthenticationProvider.createToken(user));
        user.setPassword(null);
        //user.setUserRole(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid SignUp user) {
        User createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(createdUser));
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }

}
