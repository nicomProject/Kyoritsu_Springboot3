package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;

import com.enicom.board.kyoritsu.dao.type.AdminMenuGroupType;
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
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  AdminMenuGroup entity 정의.
 *  관리자 메뉴 그룹에 대한 정보를 가짐.
 *  Table name : mn_menu_group
**/

@Entity(name = "mn_menu_group")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdminMenuGroup {
    // Id ---------------------------------------
    @Id
    @Column(name = "code", length = 20)
    @Enumerated(EnumType.STRING)
    @Comment("메뉴 그룹")
    private AdminMenuGroupType code = AdminMenuGroupType.HOMEPAGE;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "name", length = 20)
    @Comment("메뉴명")
    private String name;

    @Column(name = "read_role")
    @Enumerated(EnumType.STRING)
    @Comment("권한 - 조회 권한")
    private RoleType readRole = RoleType.ADMIN;

    @Column(name = "edit_role")
    @Enumerated(EnumType.STRING)
    @Comment("권한 - 수정 권한")
    private RoleType editRole = RoleType.ADMIN;

    @Column(name = "order_seq")
    @Builder.Default
    @Comment("메뉴 보여질 순서 설정 - 오름차순 정렬")
    private Integer orderSeq = 0;

    @Column(name = "use_yn")
    @Builder.Default
    private Integer use = 1;

    @Column(name = "create_user", length = 50)
    private String createUser;

    @Column(name = "edit_user", length = 50)
    private String editUser;

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
    // ------------------------------------------

    // custom builder 정의------------------------
    public static AdminMenuGroupBuilder builder(){
        return new AdminMenuGroupBuilder();
    }
    public static AdminMenuGroupBuilder builder(AdminMenuGroupType type){
        return builder().code(type).name(type.getName());
    }
    // ------------------------------------------
}
