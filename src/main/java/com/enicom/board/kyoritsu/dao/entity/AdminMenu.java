package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;

import com.enicom.board.kyoritsu.dao.type.AdminMenuType;
import com.enicom.board.kyoritsu.dao.type.MenuTargetType;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

/**
 *  AdminMenu entity 정의.
 *  관리자 세부메뉴에 대한 정보를 가짐.
 *  Table name : mn_menu
**/

@Entity(name = "mn_menu")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdminMenu {
    // Id ---------------------------------------
    @Id
    @Column(name = "code", length = 20)
    @Enumerated(EnumType.STRING)
    @Comment("메뉴 코드")
    private AdminMenuType code;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "code_detail")
    @Comment("메뉴 상세 코드")
    private String codeDetail;

    @Column(name = "name", length = 20)
    @Comment("메뉴명")
    private String name;

    @Column(name = "url", length = 100)
    @Comment("메뉴 URL")
    private String url;

    @Column(name = "read_role")
    @Enumerated(EnumType.STRING)
    @Comment("권한 - 조회 권한")
    private RoleType readRole = RoleType.ADMIN;

    @Column(name = "edit_role")
    @Enumerated(EnumType.STRING)
    @Comment("권한 - 수정 권한")
    private RoleType editRole = RoleType.ADMIN;

    @Column(name = "icon")
    @Comment("아이콘 Class - FontAwesome")
    private String icon;

    @Column(name = "target")
    @Default
    @Enumerated(EnumType.STRING)
    @Comment("새창 여부 - {SELF: 사용 안함, BLANK: 사용함}")
    private MenuTargetType target = MenuTargetType.SELF;

    @Column(name = "order_seq")
    @Builder.Default
    @Comment("메뉴 보여질 순서 설정 - 오름차순 정렬")
    private Integer orderSeq = 0;

    @Column(name = "use_yn")
    @Builder.Default
    private Integer use = 1;

    @Column(name = "create_user", length = 50)
    private String createUser = "system@127.0.0.1";

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

    // Column (M:1) -----------------------------
    @ManyToOne
    @JoinColumn(name = "group_id")
    @Comment("메뉴 그룹")
    private AdminMenuGroup group;
    // ------------------------------------------

    // custom builder 정의------------------------
    public static AdminMenuBuilder builder(){
        return new AdminMenuBuilder();
    }
    public static AdminMenuBuilder builder(AdminMenuType type){
        return builder().code(type).name(type.getName()).url(String.format("/admin/%s", type.getCode()));
    } 
    // ------------------------------------------
}
