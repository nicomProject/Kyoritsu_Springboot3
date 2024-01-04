package com.enicom.board.kyoritsu.api.param;

import jakarta.validation.constraints.NotNull;
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
public class CodeParam {
    @NotNull(message = "변경하실 코드 값을 입력해 주세요")
    private String value;
}
