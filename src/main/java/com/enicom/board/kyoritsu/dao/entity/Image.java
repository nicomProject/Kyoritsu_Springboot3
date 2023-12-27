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
 *  Image entity 정의.
 *  이미지의 이름 및 경로를 저장하고 있음.
 *  Table name : tb_image
**/

@Entity(name = "tb_image")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@SequenceGenerator(name = "SEQ_NOTICE_GENERATOR", sequenceName = "SEQ_NOTICE", initialValue = 1, allocationSize = 1)
public class Image {
    // field ------------------------------------
    private String key;
    private String value;
    private String imageName;
    private String path;
    // ------------------------------------------

    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_NOTICE_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "create_user", length = 50)
    private String createUser;

    @Column(name = "create_date")
    @Builder.Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createDate = LocalDateTime.now();
    // ------------------------------------------
}