package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.type.RoleType;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *  관리자 정보를 담기 위한 class 정의.
**/

@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserInfoParam {
    @NotBlank(message = "관리자 아이디는 필수입니다.")
    private String id;
    @NotBlank(message = "관리자 이름은 필수입니다.")
    private String name;
    private RoleType role;
    private Integer enable;
    private String key;
}