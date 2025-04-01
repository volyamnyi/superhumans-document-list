package com.superhumans.model.user;

public record SignUp (String firstName, String lastName, String middleName, String login, char[] password, String userRole, String businessRole) { }
