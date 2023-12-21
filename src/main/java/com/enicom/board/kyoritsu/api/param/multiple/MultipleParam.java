package com.enicom.board.kyoritsu.api.param.multiple;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class MultipleParam {
    private MultipleType type;

    private String key;

    // 강제 집행 여부
    private Boolean force;

    // ONE 조건 값
    private String id;

    // LIST 조건 목록
    private List<String> idList;
    private List<Long> idListLong;
    private Map<String, Object> updateList;

    // SPECIFIC 조건 field
    private String field;

    // SPECIFIC 조건 value
    private String value;

    public boolean isValid() {
        // 하나 삭제의 경우 id 필수
        if (type.equals(MultipleType.ONE) && id == null) {
            return false;
        }
        // List 삭제의 경우 idList 필수
        else if (type.equals(MultipleType.LIST) && idList == null) {
            return false;
        }
        // 특정 조건일 경우 field, value 값 필수
        else return !type.equals(MultipleType.SPECIFIC) || (field != null && value != null);
    }
}
