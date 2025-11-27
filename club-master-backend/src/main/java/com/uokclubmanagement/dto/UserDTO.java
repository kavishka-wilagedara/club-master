package com.uokclubmanagement.dto;

public class UserDTO {

    private String role;
    private String username;
    private String id;
    private String token;

    public UserDTO(String role, String username, String id, String token) {
        this.role = role;
        this.username = username;
        this.id = id;
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }

    public String getId() {
        return id;
    }

    public String getToken() {
        return token;
    }
}
