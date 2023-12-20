package com.enicom.board.kyoritsu.api.vo;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Builder
@Data
@ToString
public class RoleVO {
    private String key;
    private String value;
    private Integer rank;
}
