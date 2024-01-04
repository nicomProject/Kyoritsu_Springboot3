package com.enicom.board.kyoritsu.api.param.file;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FileInfoParam {
    String folder;
    String name;
}
