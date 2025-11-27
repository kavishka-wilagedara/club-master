package com.uokclubmanagement.entity;

import java.util.List;

public class UserHelpResponse {

    private int count;
    private List<UserHelp> userHelpList;

    public UserHelpResponse(int count, List<UserHelp> userHelpList) {
        this.count = count;
        this.userHelpList = userHelpList;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<UserHelp> getUserHelpList() {
        return userHelpList;
    }

    public void setUserHelpList(List<UserHelp> userHelpList) {
        this.userHelpList = userHelpList;
    }
}
