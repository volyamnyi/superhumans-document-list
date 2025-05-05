package com.superhumans.repository;


import com.superhumans.exception.AppException;
import com.superhumans.model.user.Role;
import com.superhumans.model.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

/**
 * Репозиторій для управління користувачами у базі даних.
 * Надає методи для пошуку, створення, оновлення та видалення користувачів.
 */
@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserRepository {

    /**
     * Компонент для виконання SQL-запитів до бази даних.
     */
    JdbcTemplate jdbcTemplate;

    /**
     * Шукає користувача за логіном.
     *
     * @param login логін користувача
     * @return об'єкт Optional, який містить знайденого користувача або порожній, якщо користувача не знайдено
     */
    public Optional<User> findByLogin(String login) {
        RowMapper<User> mapper = new RowMapper() {

            @SneakyThrows
            @Override
            public User mapRow(ResultSet rs, int rowNum) {
                User user = new User();
                user.setId(rs.getObject("SH_UserId", Integer.class));
                user.setFirstName(rs.getObject("firstName", String.class));
                user.setLastName(rs.getObject("lastName", String.class));
                user.setLogin(rs.getObject("login", String.class));
                user.setPassword(rs.getObject("password", String.class));
                user.setUserRole(Role.valueOf(rs.getObject("user_role", String.class)));
                user.setBusinessRole(rs.getObject("business_role", String.class));

                return user;
            }
        };

        List<User> result = jdbcTemplate.query("SELECT * FROM SH_Users WHERE login = ?", mapper, login);


        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    /**
     * Зберігає нового користувача у базі даних.
     * Якщо користувач з таким логіном вже існує — кидає виняток.
     *
     * @param user користувач, якого потрібно зберегти
     * @return збережений користувач
     * @throws AppException якщо користувач з таким логіном вже існує або не вдалося знайти збереженого користувача
     */
    public User save(User user) {
        if (findByLogin(user.getLogin()).isEmpty()) {
            String sql = "INSERT INTO SH_Users (firstName, lastName, middleName, login, password, user_role, business_role) VALUES (?,?,?,?,?,?,?);";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            String finalSql = sql;
            jdbcTemplate.update(
                    connection -> {
                        PreparedStatement ps = connection.prepareStatement(finalSql, Statement.RETURN_GENERATED_KEYS);
                        ps.setString(1, user.getFirstName());
                        ps.setString(2, user.getLastName());
                        ps.setString(3, user.getMiddleName());
                        ps.setString(4, user.getLogin());
                        ps.setString(5, user.getPassword());
                        ps.setString(6, String.valueOf(user.getUserRole()));
                        ps.setString(7, user.getBusinessRole());
                        return ps;
                    },
                    keyHolder
            );

            Integer userId = ((BigDecimal) keyHolder.getKeyList().get(keyHolder.getKeyList().size() - 1).get("GENERATED_KEYS")).intValue();

            return findByLogin(user.getLogin()).orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        }

        throw new AppException("User is already registered", HttpStatus.NOT_FOUND);
    }

    /**
     * Отримує список усіх користувачів з бази даних.
     *
     * @return список користувачів
     */
    public List<User> getAllUsers() {
        RowMapper<User> mapper = new RowMapper() {

            @Override
            @SneakyThrows
            public User mapRow(ResultSet rs, int rowNum) {
                User user = new User();
                user.setId(rs.getObject("SH_UserId", Integer.class));
                user.setFirstName(rs.getObject("firstName", String.class));
                user.setLastName(rs.getObject("lastName", String.class));
                user.setMiddleName(rs.getObject("middleName", String.class));
                user.setLogin(rs.getObject("login", String.class));
                user.setBusinessRole(rs.getObject("business_role", String.class));
                user.setUserRole(Role.valueOf(rs.getObject("user_role", String.class)));
                return user;
            }
        };
        return jdbcTemplate.query("SELECT * FROM SH_Users", mapper);
    }

    /**
     * Оновлює дані користувача за його ідентифікатором.
     *
     * @param user об'єкт користувача з оновленими даними
     * @return оновлений користувач
     * @throws AppException якщо користувача не знайдено після оновлення
     */
    public User updateUserById(User user) {
        System.out.println(user);
        String sql = "UPDATE SH_Users SET firstName = ?,lastName = ?,middleName = ?,login = ?,password = ?,business_role = ?,user_role = ? WHERE SH_UserId = ?;";
        jdbcTemplate.update(
                sql,
                user.getFirstName(),
                user.getLastName(),
                user.getMiddleName(),
                user.getLogin(),
                user.getPassword(),
                user.getBusinessRole(),
                user.getUserRole().toString(),
                user.getId()
        );

    return findByLogin(user.getLogin()).orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    /**
     * Видаляє користувача з бази даних за його ідентифікатором.
     *
     * @param id ідентифікатор користувача
     */
    public void deleteUserById(Integer id) {
        String sql = "DELETE FROM SH_Users WHERE SH_UserId = ?";
        jdbcTemplate.update(sql, id);
    }

}
