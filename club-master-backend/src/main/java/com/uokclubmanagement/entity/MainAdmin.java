package com.uokclubmanagement.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("main-admin")
public class MainAdmin {

    @Id
    private String mainAdminId;

    private String mainAdminName;
    @Indexed(unique = true)
    private String mainAdminEmail;
    private String mainAdminPhone;
    @Indexed(unique = true)
    private String mainAdminUsername;
    private String mainAdminPassword;
    private String mainAdminImageUrl;

    public MainAdmin() {
    }

    public String getMainAdminId() {
        return mainAdminId;
    }

    public void setMainAdminId(String mainAdminId) {
        this.mainAdminId = mainAdminId;
    }

    public String getMainAdminName() {
        return mainAdminName;
    }

    public void setMainAdminName(String mainAdminName) {
        this.mainAdminName = mainAdminName;
    }

    public String getMainAdminPassword() {
        return mainAdminPassword;
    }

    public void setMainAdminPassword(String mainAdminPassword) {
        this.mainAdminPassword = mainAdminPassword;
    }

    public String getMainAdminEmail() {
        return mainAdminEmail;
    }

    public void setMainAdminEmail(String mainAdminEmail) {
        this.mainAdminEmail = mainAdminEmail;
    }

    public String getMainAdminPhone() {
        return mainAdminPhone;
    }

    public void setMainAdminPhone(String mainAdminPhone) {
        this.mainAdminPhone = mainAdminPhone;
    }

    public String getMainAdminUsername() {
        return mainAdminUsername;
    }

    public void setMainAdminUsername(String mainAdminUsername) {
        this.mainAdminUsername = mainAdminUsername;
    }

    public String getMainAdminImageUrl() {
        return mainAdminImageUrl;
    }

    public void setMainAdminImageUrl(String mainAdminImageUrl) {
        this.mainAdminImageUrl = mainAdminImageUrl;
    }
}
