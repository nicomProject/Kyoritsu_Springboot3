package com.enicom.board.kyoritsu.api.param.multiple;

import com.fasterxml.jackson.annotation.JsonCreator;

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
