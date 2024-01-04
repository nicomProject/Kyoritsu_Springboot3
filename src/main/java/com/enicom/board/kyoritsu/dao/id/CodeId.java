package com.enicom.board.kyoritsu.dao.id;

import java.io.Serializable;

import com.enicom.board.kyoritsu.dao.type.CodeGroupType;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Builder.Default;

/**
 *  Code entity에서 복합키로 group+code를 사용하기 위해 정의
**/

@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CodeId implements Serializable {
    // Id ---------------------------------------
    @Id
    @Column(name = "grp", length = 10)
    @Enumerated(EnumType.STRING)
    @Default
    private CodeGroupType group = CodeGroupType.SYSTEM;

    @Id
    @NonNull
    @Column(name = "code", length = 20, nullable = false)
    private String code;
    // ------------------------------------------
}
