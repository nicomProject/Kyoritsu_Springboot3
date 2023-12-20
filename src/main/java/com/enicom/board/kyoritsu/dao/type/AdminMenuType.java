package com.enicom.board.kyoritsu.dao.type;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 *  AdminMenu의 type을 정의.
**/

@RequiredArgsConstructor
@Getter
public enum AdminMenuType {
    INTRODUCTIONS("introductions", "소개글 관리"),
    NOTICES("notices", "공지사항 관리"),
    JOBS("jobs", "채용 공고 관리"),
    APPLICANTS("applicants", "지원자 조회"),
    INQUIRES("inquires", "채용 문의"),
    ACCOUNTS("accounts", "관리자 계정 조회"),
    ACCESS("access", "접속 기록");

    @JsonValue // code를 Json 직렬화 값으로 사용하도록 함
    private final String code;

    private final String name;
}
