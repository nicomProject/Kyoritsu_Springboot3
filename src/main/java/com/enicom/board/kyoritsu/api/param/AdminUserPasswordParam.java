package com.enicom.board.kyoritsu.api.param;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

/**
 *  특정 관리자 비밀번호 변경을 위한 값을 담을 class 정의.
**/

@Builder
@Getter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
public class AdminUserPasswordParam {
    @NotNull(message = "현재 사용중인 비밀번호 입력은 필수입니다.")
    private String password;
    @NotNull(message = "변경할 비밀번호 입력은 필수입니다.")
    private String newPassword;
    @NotNull(message = "변경할 비밀번호 확인 입력은 필수입니다.")
    private String newPasswordConfirm;
    private String key;
}