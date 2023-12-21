package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.type.RoleType;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserInfoParam {
    @NotBlank
    private String id;
    @NotBlank
    private String name;
    private RoleType role;
    private Integer enable;
    private String key;
}