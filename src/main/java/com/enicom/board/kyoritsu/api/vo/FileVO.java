package com.enicom.board.kyoritsu.api.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class FileVO {
    private String name;
    private String path;
    private Long size;
    private LocalDateTime createDate;
    private LocalDateTime editDate;
    private LocalDateTime accessDate;
}
