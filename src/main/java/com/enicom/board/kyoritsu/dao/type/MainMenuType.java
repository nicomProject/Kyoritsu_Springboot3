package com.enicom.board.kyoritsu.dao.type;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 *  MainMenu의 type을 정의.
**/

@AllArgsConstructor
@Getter
public enum MainMenuType {
    GROUP("group", "메뉴 그룹"),
    GENERAL("general", "일반 페이지"),
    INTRO("intro", "소개 페이지");

    @JsonValue
    private final String code;
    private final String name;
}
