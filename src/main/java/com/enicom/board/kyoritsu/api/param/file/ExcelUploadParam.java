package com.enicom.board.kyoritsu.api.param.file;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExcelUploadParam {
    private Integer startRow = 1;
    private String room;
    private String range;
}