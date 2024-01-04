package com.enicom.board.kyoritsu.api.type;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class InfoVO<T> {
    private T info;

    private static <T> InfoVOBuilder<T> builder() {
        return new InfoVOBuilder<T>();
    }

    public static <T> InfoVOBuilder<T> builder(T info) {
        return (InfoVOBuilder<T>) builder().info(info);
    }
}
