package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import com.enicom.board.kyoritsu.dao.id.CodeId;
import com.enicom.board.kyoritsu.dao.type.CodeGroupType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.Builder.Default;

/**
 *  Code entity 정의.
 *  initPwd 같은 데이터에 대한 정보를 가짐.
 *  특정 데이터를 value1,2,3에 저장하기 위한 엔티티.
 *  Table name : tb_code
**/

@Entity(name = "tb_code")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@ToString
@IdClass(CodeId.class)
public class Code {
    // Id ---------------------------------------
    @Id
    @Column(name = "grp", length = 10)
    @Enumerated(EnumType.STRING)
    @Default
    private CodeGroupType group = CodeGroupType.SYSTEM;

    @Id
    @Column(name = "code", length = 20, nullable = false)
    private String code;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "value1", length = 100)
    private String value1;

    @Column(name = "value2", length = 100)
    private String value2;

    @Column(name = "value3", length = 100)
    private String value3;

    @Column(name = "use_yn")
    private Integer use_yn;

    @Column(name = "description", length = 3000)
    private String description;

    @Column(name = "create_user")
    private String createUser;

    @Column(name = "edit_user")
    private String editUser;

    @Column(name = "delete_user")
    private String deleteUser;

    @Column(name = "create_date")
    @Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "edit_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime editDate;

    @Column(name = "delete_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime deleteDate;
    // ------------------------------------------

    // custom builder 정의------------------------
    public static CodeBuilder builder() {
        return new CodeBuilder();
    }
    public static CodeBuilder builder(String key, String value) {
        return builder().code(key).value1(value);
    }
    public static CodeBuilder builder(CodeGroupType group, String key) {
        return builder().group(group).code(key);
    }
    public static CodeBuilder builder(CodeGroupType group, String key, String value) {
        return builder().group(group).code(key).value1(value);
    }
    // ------------------------------------------
}
