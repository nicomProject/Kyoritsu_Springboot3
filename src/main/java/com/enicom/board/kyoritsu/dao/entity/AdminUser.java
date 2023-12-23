package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.type.RoleType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

/**
 *  AdminUser entity 정의.
 *  관리자 계정에 대한 정보를 가짐.
 *  Table name : mn_user
**/

@Entity(name = "mn_user")
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@SequenceGenerator(name = "SEQ_ADMINUSER_GENERATOR", sequenceName = "SEQ_ADMINUSER", initialValue = 1, allocationSize = 1)
public class AdminUser {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_ADMINUSER_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------
    
    // Column -----------------------------------
    @Column(name = "id", length = 20, unique = true, nullable = false)
    @NonNull
    private String userId;

    @Column(name = "password", length = 200, nullable = false)
    private String password;

    @Column(name = "name", length = 20)
    private String name;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 10)
    private RoleType role = RoleType.ADMIN;

    @Builder.Default
    @Column(name = "enable")
    private Integer enable = 1;

    @Builder.Default
    @Column(name = "failure_cnt")
    private Integer failureCnt = 0;

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

    @Column(name = "login_date")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime loginDate;
    // ------------------------------------------

    // userId, password를 가지고 Spring security의 UserDetails를 구현한 MemberDetail로 변환 후 반환
    public MemberDetail toMember() {
        MemberDetail member = MemberDetail.builder().id(userId).password(password).build();
        if (name != null) {
            member.setName(name);
        }
        if (role != null) {
            member.setRole(role);
        }
        if (enable != null) {
            member.setEnable(enable);
        }
        if (failureCnt != null) {
            member.setFailureCnt(failureCnt);
        }
        return member;
    }

}
