package com.enicom.board.kyoritsu.api.param;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *  code 데이터 변경값을 담을 class 정의.
**/

@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CodeParam {
    @NotNull(message = "변경하실 code 값은 필수입니다.")
    private String value;
}
