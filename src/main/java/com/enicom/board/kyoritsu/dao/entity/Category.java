package com.enicom.board.kyoritsu.dao.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 *  Category entity 정의.
 *  지원 분야 카테고리 정보를 담고 있음.
 *  Table name : tb_category
**/

@Entity(name = "tb_category")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@SequenceGenerator(name = "SEQ_CATEGORY_GENERATOR", sequenceName = "SEQ_CATEGORY", initialValue = 1, allocationSize = 1)
public class Category {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_CATEGORY_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "category_name", length = 10000)
    private String categoryName;

    @Column(name = "create_user", length = 50)
    private String createUser;

    @Column(name = "delete_user", length = 50)
    private String deleteUser;

    @Column(name = "create_date")
    @Builder.Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "delete_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime deleteDate;
    // ------------------------------------------
}