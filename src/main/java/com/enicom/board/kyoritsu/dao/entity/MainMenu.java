package com.enicom.board.kyoritsu.dao.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;

import com.enicom.board.kyoritsu.dao.type.MainMenuType;
import com.enicom.board.kyoritsu.dao.type.MenuTargetType;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  MainMenu entity 정의.
 *  메인 메뉴 그룹 및 하위 메뉴에 대한 정보를 가짐.
 *  Table name : tb_menu
**/

@Entity(name = "tb_menu")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
// SELECT sequence_name FROM information_schema.sequences; 로 seq_mainmenu 가 있는지 확인
// CREATE SEQUENCE SEQ_MAINMENU START 1; 로 seq_mainmenu 생성
@SequenceGenerator(name = "SEQ_MAINMENU_GENERATOR", sequenceName = "SEQ_MAINMENU", initialValue = 1, allocationSize = 1)
public class MainMenu {
    // Id ---------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_MAINMENU_GENERATOR")
    @Column(name = "rec_key")
    private Long recKey;
    // ------------------------------------------

    // Column -----------------------------------
    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "url", length = 100)
    private String url;

    @Column(name = "type", length = 10, nullable = false)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Comment("메뉴 타입 - { intro: 소개페이지, group: 메뉴 그룹, genernal: 일반 }")
    private MainMenuType type = MainMenuType.INTRO;

    @Column(name = "target", length = 10, nullable = false)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Comment("새창 여부 - {self: 사용 안함, blank: 사용함}")
    private MenuTargetType target = MenuTargetType.SELF;

    @Column(name = "order_seq")
    @Builder.Default
    @ColumnDefault("0")
    @Comment("메뉴 보여질 순서 설정 - 오름차순 정렬")
    private Integer order = 0;

    @Column(name = "use_yn")
    @Builder.Default
    @ColumnDefault("1")
    private Integer use = 1;

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

    // Column (M:1) -----------------------------
    @ManyToOne
    @JoinColumn(name = "p_id")
    @Comment("메뉴 parent")
    private MainMenu menu;

    @ManyToOne
    @JoinColumn(name = "content_id")
    private Content content;
    // ------------------------------------------
}
