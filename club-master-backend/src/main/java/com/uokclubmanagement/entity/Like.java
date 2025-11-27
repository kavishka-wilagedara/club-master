package com.uokclubmanagement.entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Like {

    private List<String> membersLike =new ArrayList<>();
    private List<String> membersDislike =new ArrayList<>();

    public Like() {}

    public List<String> getMembersLike() {
        return membersLike;
    }

    public void setMembersLike(List<String> membersLike) {
        this.membersLike = membersLike;
    }

    public List<String> getMembersDislike() {
        return membersDislike;
    }

    public void setMembersDislike(List<String> membersDislike) {
        this.membersDislike = membersDislike;
    }
}
