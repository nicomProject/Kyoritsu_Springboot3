package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;

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
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  Content entity 정의.
 *  Table name : tb_content
**/

@Entity(name = "tb_content")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SequenceGenerator(name = "SEQ_CONTENT_GENERATOR", sequenceName = "SEQ_CONTENT", initialValue = 1, allocationSize = 1)
public class Content {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_CONTENT_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "title", length = 20)
    private String title;

    @Column(name = "subtitle", length = 100)
    private String subtitle;

    @Column(name = "category", length = 20)
    private String category;

    @Column(name = "subcategory", length = 20)
    private String subcategory;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "hit")
    @Builder.Default
    @Comment("조회수")
    @ColumnDefault("0")
    private Integer hit = 0;

    @Column(name = "create_user", length = 50)
    private String createUser;

    @Column(name = "edit_user", length = 50)
    private String editUser;

    @Column(name = "delete_user", length = 50)
    private String deleteUser;

    @Column(name = "create_date")
    @Builder.Default
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

    // Transient --------------------------------
    @Transient // 해당 값은 column에 포함시키지 않음
    @Column(name = "check_content", length = 50)
    private String checkContent;
    // ------------------------------------------
}