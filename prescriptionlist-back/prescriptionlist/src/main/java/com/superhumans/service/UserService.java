package com.superhumans.service;

import com.superhumans.exception.AppException;
import com.superhumans.model.user.Credentials;
import com.superhumans.model.user.Role;
import com.superhumans.model.user.SignUp;
import com.superhumans.model.user.User;
import com.superhumans.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    //private final UserMapper userMapper;

    public User login(Credentials credentials) {
        User user = userRepository.findByLogin(credentials.login())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentials.password()), user.getPassword())) {
            return user;
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public User register(SignUp userDto) {
        Optional<User> optionalUser = userRepository.findByLogin(userDto.login());

        if (optionalUser.isPresent()) {
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());
        user.setMiddleName(userDto.middleName());
        user.setLogin(userDto.login());
        user.setBusinessRole(userDto.businessRole());
        user.setUserRole(Role.valueOf(userDto.userRole()));
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.password())));

        User savedUser = userRepository.save(user);

        return savedUser;
    }

    public User findByLogin(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return user;
    }

}
