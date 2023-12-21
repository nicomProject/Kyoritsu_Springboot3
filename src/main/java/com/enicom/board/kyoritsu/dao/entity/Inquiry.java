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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  Inquiry entity 정의.
 *  Table name : tb_inquiry
**/

@Entity(name = "tb_inquiry")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@SequenceGenerator(name = "SEQ_INQUIRY_GENERATOR", sequenceName = "SEQ_INQUIRY", initialValue = 1, allocationSize = 1)
public class Inquiry {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_INQUIRY_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "inquiry_title", length = 100)
    private String inquiryTitle;

    @Column(name = "answer", length = 10000)
    private String answer;

    @Column(name = "inquiry_name", length = 200)
    @Comment("문의 작성한 사용자 아이디")
    private String inquiryName;

    @Column(name = "inquiry_pwd", length = 200)
    @Comment("문의 작성한 사용자 비밀번호")
    private String inquiryPwd;

    @Column(name = "inquiry_phone", length = 200)
    @Comment("문의 작성한 사용자 핸드폰번호")
    private String inquiryPhone;

    @Column(name = "inquiry_content", length = 10000)
    @Comment("문의 작성한 내용")
    private String inquiryContent;

    @Column(name = "inquiry_secret")
    @Comment("문의 공개 여부")
    private String inquirySecret;

    @Column(name = "answer_user", length = 50)
    private String answerUser;

    @Column(name = "delete_user", length = 50)
    private String deleteUser;

    @Column(name = "hit")
    @Builder.Default
    @Comment("조회수")
    @ColumnDefault("0")
    private Integer hit = 0;

    @Column(name = "create_date")
    @Builder.Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "update_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updateDate;

    @Column(name = "answer_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime answerDate;

    @Column(name = "delete_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime deleteDate;
    // ------------------------------------------
}
