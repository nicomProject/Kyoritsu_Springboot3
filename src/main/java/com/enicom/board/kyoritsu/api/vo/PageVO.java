package com.enicom.board.kyoritsu.api.vo;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.Builder.Default;

/**
 *  Page Value Object 정의. 
 *  Pagenation된 데이터를 처리 및 관리하는데 사용.
**/

@Builder
@Setter
@Getter
public class PageVO<T> {
    // field 정의
    @Default
    private int pageIdx = 1;
    @Default
    private int pageSize = 25;
    @Default
    private int lastPage = 1;
    @NonNull
    private List<T> items;
    @Default
    private long count = 0;

    // custom builder 정의
    public static <T> PageVOBuilder<T> builder() {
        return new PageVOBuilder<>();
    }
    public static <T> PageVOBuilder<T> builder(T item) {
        List<T> items = List.of(item);
        return PageVO.<T>builder().items(items).pageSize(items.size()).count(items.size());
    }
    public static <T> PageVOBuilder<T> builder(List<T> items) {
        return PageVO.<T>builder().items(items).pageSize(items.size()).count(items.size());
    }
    public static <T> PageVOBuilder<T> builder(Page<T> page) {
        return PageVO.<T>builder()
                .items(page.toList())
                .count(page.getTotalElements())
                .pageIdx(page.getNumber()+1)
                .pageSize(page.getSize())
                .lastPage(page.getTotalPages());
    }

    // Java에서는 Generic + Array (T...) 생성을 금지하고 있기 때문에 사용하지 않는 것이 좋음
    // @SafeVarargs
    // public static <T> PageVOBuilder<T> builder(T... items) {
    //     return PageVO.<T>builder().items(Arrays.asList(items)).pageSize(items.length).count(items.length);
    // }
}