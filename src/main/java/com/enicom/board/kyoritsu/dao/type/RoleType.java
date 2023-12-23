package com.enicom.board.kyoritsu.dao.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 *  Role의 type을 정의.
**/

@RequiredArgsConstructor
@Getter
public enum RoleType {
    // USER("ROLE_USER", "일반 사용자", 2),
    ADMIN("ROLE_ADMIN", "관리자", 1),
    SYSTEM("ROLE_SYSTEM", "시스템 관리자", 0);

    private final String name;
    private final String alias;
    private final Integer rank;
}
