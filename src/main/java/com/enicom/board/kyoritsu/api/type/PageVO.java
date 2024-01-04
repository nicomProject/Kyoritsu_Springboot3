package com.enicom.board.kyoritsu.api.type;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Builder
@Setter
@Getter
public class PageVO<T> {
    public static final String columns = "pageIdx, pageSize";
    @Builder.Default
    private int pageIdx = 1;

    @Builder.Default
    private int pageSize = 25;

    @Builder.Default
    private int lastPage = 1;

    @NonNull
    private T[] items;

    @Builder.Default
    private long count = 0;

    public static <T> PageVOBuilder<T> builder(){
        return new PageVOBuilder<T>();
    }
    public static <T> PageVOBuilder<T> builder(List<T> items) {
        return (PageVOBuilder<T>) builder().items(items.toArray()).pageSize(items.size()).count(items.size());
    }

    public static <T> PageVOBuilder<T> builder(T... items) {
        return (PageVOBuilder<T>) builder().items(items).pageSize(items.length).count(items.length);
    }

    public static <T> PageVOBuilder<T> builder(Page<T> page) {
        return (PageVOBuilder<T>) builder()
                .items(page.toList().toArray())
                .count(page.getTotalElements())
                .pageIdx(page.getNumber() + 1)
                .pageSize(page.getSize())
                .lastPage(page.getTotalPages());
    }
}
