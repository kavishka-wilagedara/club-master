package com.uokclubmanagement.dto;

import lombok.Data;

@Data
public class NewPasswordDTO {

    private String newPassword;
    private String token;

    public String getNewPassword() {
        return newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }


}
