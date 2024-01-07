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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

/**
 *  Applicant entity 정의.
 *  지원자에 대한 정보를 담고 있음.
 *  Table name : tb_applicant
**/

@Entity(name = "tb_applicant")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@SequenceGenerator(name = "SEQ_APPLICANT_GENERATOR", sequenceName = "SEQ_APPLICANT", initialValue = 1, allocationSize = 1)
public class Applicant {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_APPLICANT_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "category", length = 20)
    @Comment("채용공고 카테고리")
    private String category;

    @Column(name = "career", length = 100)
    @Comment("경력구분")
    private String career;

    @Column(name = "profilePath", length = 1000)
    @Comment("증명사진 경로")
    private String profilePath;

    @Column(name = "filesPath", length = 1000)
    @Comment("첨부파일 경로")
    private String[] filesPath;

    @Column(name = "name", length = 50)
    @Comment("지원자명")
    private String name;

    @Column(name = "gender", length = 50)
    @Comment("성별")
    private String gender;

    @Column(name = "birth_date")
    @Comment("생년월일")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDateTime birthDate;

    @Column(name = "create_date")
    @Builder.Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "nationality", length = 50)
    @Comment("국적")
    private String nationality;

    @Column(name = "phone", length = 50)
    @Comment("휴대전화")
    private String phone;

    @Column(name = "email", length = 50)
    @Comment("이메일")
    private String email;

    @Column(name = "contents", length = 10000)
    @Comment("자기소개서")
    private String contents;

    @Column(name = "pass_yn", length = 20)
    @Comment("합격여부")
    private String passYn;

    @Column(name = "form_tag", length = 20)
    @Comment("폼태그")
    private String formTag;

    @Column(name = "content_answer", length = 10000)
    @Comment("조회결과내용")
    private String contentAnswer;

    @Column(name = "answer_id", length = 10000)
    @Comment("답변자")
    private String answerId;

    @Column(name = "answer_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime answerDate;
    // ------------------------------------------

    // Column (M:1) -----------------------------
    @ManyToOne
    @JoinColumn(name = "job_id")
    @Comment("지원공고")
    private Job jobId;

//    @ManyToOne
//    @JoinColumn(name = "result_id")
//    @Comment("지원자 ID")
//    private Content resultId;
    // ------------------------------------------
}