package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

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

/**
 *  AccessLog entity 정의.
 *  관리자 로그인 기록에 대한 정보를 가짐.
 *  Table name : mn_access_log
**/

@Entity(name = "mn_access_log")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@SequenceGenerator(name = "SEQ_ACCESS_GENERATOR", sequenceName = "SEQ_ACCESS", initialValue = 1, allocationSize = 1)
public class AccessLog {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_ACCESS_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "login_ip", length = 20)
    private String loginIp;

    @Column(name = "login_id", length = 20)
    private String loginId;
    
    @Column(name = "login_result")
    @Builder.Default
    @Comment("로그인 성공 여부 {1: 성공, 0: 실패}")
    private Integer loginResult = 1;

    @Column(name = "login_date")
    @Builder.Default
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime loginDate = LocalDateTime.now();
    // ------------------------------------------
}