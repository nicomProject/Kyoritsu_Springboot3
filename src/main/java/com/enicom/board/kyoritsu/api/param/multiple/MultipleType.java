package com.enicom.board.kyoritsu.api.param.multiple;

import com.fasterxml.jackson.annotation.JsonCreator;
/**
 *  다중 요청 유형을 정의한 enum class.
**/

public enum MultipleType {
    ONE, LIST, SPECIFIC, ALL, RANGE;

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static MultipleType from(String code) {
        for (MultipleType type : MultipleType.values()) {
            if (type.name().equalsIgnoreCase(code)) {
                return type;
            }
        }
        return null;
    }
}
