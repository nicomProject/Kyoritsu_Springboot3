package com.enicom.board.kyoritsu.api.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 *  Info Value Object 정의. 
 *  단일 정보 및 객체 데이터를 처리 및 관리하는데 사용.
**/

@Builder
@Getter
@Setter
public class InfoVO<T> {
    // field 정의
    private T info;

    // custom builder 정의
    private static <T> InfoVOBuilder<T> builder() {
        return new InfoVOBuilder<>();
    }
    public static <T> InfoVOBuilder<T> builder(T info) {
        return InfoVO.<T>builder().info(info);
    }
}
