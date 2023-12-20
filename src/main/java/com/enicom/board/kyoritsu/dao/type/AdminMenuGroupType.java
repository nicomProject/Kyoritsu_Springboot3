package com.enicom.board.kyoritsu.dao.type;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 *  AdminMenuGroup의 type을 정의.
**/

@RequiredArgsConstructor
@Getter
public enum AdminMenuGroupType {
    HOMEPAGE("homepage", "홈페이지 관리"),
    RECRUIT("recruit","채용 관리"),
    SYSTEM("system", "시스템 관리");

    @JsonValue // code를 Json 직렬화 값으로 사용하도록 함
    private final String code;

    private final String name;

    // Json에서 받아온 String을 Enum으로 변환하기 위해 정의
    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static AdminMenuGroupType from(String code) {
        for (AdminMenuGroupType type : AdminMenuGroupType.values()) {
            if (type.name().equalsIgnoreCase(code)) {
                return type;
            }
        }
        return null;
    } 
}
