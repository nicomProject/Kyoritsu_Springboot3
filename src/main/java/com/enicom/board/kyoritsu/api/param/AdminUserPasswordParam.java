package com.enicom.board.kyoritsu.api.param;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
public class AdminUserPasswordParam {
    @NotNull
    private String password;
    @NotNull
    private String newPassword;
    @NotNull
    private String newPasswordConfirm;
    private String key;
}