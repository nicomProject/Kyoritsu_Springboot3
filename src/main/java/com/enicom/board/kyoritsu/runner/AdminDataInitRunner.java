package com.enicom.board.kyoritsu.runner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.enicom.board.kyoritsu.dao.entity.AdminMenu;
import com.enicom.board.kyoritsu.dao.entity.AdminMenuGroup;
import com.enicom.board.kyoritsu.dao.entity.AdminUser;
import com.enicom.board.kyoritsu.dao.repository.AdminMenuGroupRepository;
import com.enicom.board.kyoritsu.dao.repository.AdminMenuRepository;
import com.enicom.board.kyoritsu.dao.repository.AdminUserRepository;
import com.enicom.board.kyoritsu.dao.repository.CodeRepository;
import com.enicom.board.kyoritsu.dao.type.AdminMenuGroupType;
import com.enicom.board.kyoritsu.dao.type.AdminMenuType;
import com.enicom.board.kyoritsu.dao.type.RoleType;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import lombok.extern.slf4j.Slf4j;

/**
 *  DB에 기본적으로 저장되어야 할 Admin 데이터를 저장. 
 *  기존 DB 저장값은 건들지 않도록 하되, 기본 사항 누락에 대해서는 추가되도록 함.
**/

@Component
@Slf4j
public class AdminDataInitRunner implements ApplicationRunner {
    // field 정의
    private final SecurityUtil securityUtil;
    private final CodeRepository codeRepository;
    private final AdminUserRepository adminUserRepository;
    private final AdminMenuRepository adminMenuRepository;
    private final AdminMenuGroupRepository adminMenuGroupRepository;
    
    @Autowired
    public AdminDataInitRunner(SecurityUtil securityUtil, CodeRepository codeRepository, AdminUserRepository adminUserRepository,
                          AdminMenuRepository adminMenuRepository, AdminMenuGroupRepository adminMenuGroupRepository) {
        this.securityUtil = securityUtil;
        this.codeRepository = codeRepository;
        this.adminUserRepository = adminUserRepository;
        this.adminMenuRepository = adminMenuRepository;
        this.adminMenuGroupRepository = adminMenuGroupRepository;
    }

    // 프로그램 실행 시, 최초 1회 실행
    @Override
    public void run(ApplicationArguments args) throws Exception {
        configureCode();                            // code entity 추가 (초기 비밀번호 설정)
        configureAdminUser();                       // adminUser 추가 (초기 관리자 유저 설정) 
        configureAdminMenuGroupAndAdminMenu();      // adminMenuGroup & adminMenu 추가 (초기 관리자 메뉴 그룹 및 메뉴 설정)
    }

    // code entity 추가 (초기 비밀번호 설정)
    private void configureCode() {
        codeRepository.save(securityUtil.getInitPwd());
    }

    // adminUser entity 추가 (초기 관리자 유저 설정) 
    private void configureAdminUser() {
        AdminUser adminUser = adminUserRepository.findByUserId("dormy")
                .orElse(AdminUser.builder().userId("dormy").name("나이콤 관리자").password(securityUtil.getEncodedInitPwd()).createDate(LocalDateTime.now()).build());
        adminUser.setRole(RoleType.SYSTEM);
        adminUserRepository.save(adminUser);
    }

    // adminMenuGroup & adminMenu 추가 (초기 관리자 메뉴 그룹 및 메뉴 설정)
    private void configureAdminMenuGroupAndAdminMenu() {
        // DB에서 adminMenuGroup 불러오기 --------------------------------------------------------------------------
        Map<AdminMenuGroupType, AdminMenuGroup> adminGroupStoredList = new HashMap<>();
        adminMenuGroupRepository.findAll().forEach(adminGroup -> {
            adminGroupStoredList.put(adminGroup.getCode(), adminGroup);
        });

        // 기본 adminMenuGroup 정의 (후에 AdminMenuBuilder에 사용)
        AdminMenuGroup homepage = AdminMenuGroup.builder(AdminMenuGroupType.HOMEPAGE).orderSeq(1).build();
        AdminMenuGroup recruit = AdminMenuGroup.builder(AdminMenuGroupType.RECRUIT).orderSeq(2).build();
        AdminMenuGroup system = AdminMenuGroup.builder(AdminMenuGroupType.SYSTEM).orderSeq(3).build();

        // 기존 adminMenuGroup에 추가되어 있지 않은 내용이라면 groupList에 추가
        // 기존 adminMenuGroup에 추가되어 있는 내용이라면 homepage, recruit, system 변수 해당 값으로 각각 초기화
        List<AdminMenuGroup> adminGroupList = new ArrayList<>();
        if(!adminGroupStoredList.containsKey(AdminMenuGroupType.HOMEPAGE)) {
            adminGroupList.add(AdminMenuGroup.builder(AdminMenuGroupType.HOMEPAGE).orderSeq(1).build());
        } else {
            homepage = adminGroupStoredList.get(AdminMenuGroupType.HOMEPAGE);
        }
        if(!adminGroupStoredList.containsKey(AdminMenuGroupType.RECRUIT)) {
            adminGroupList.add(AdminMenuGroup.builder(AdminMenuGroupType.RECRUIT).orderSeq(2).build());
        } else {
            recruit = adminGroupStoredList.get(AdminMenuGroupType.RECRUIT);
        }
        if(!adminGroupStoredList.containsKey(AdminMenuGroupType.SYSTEM)) {
            adminGroupList.add(AdminMenuGroup.builder(AdminMenuGroupType.SYSTEM).orderSeq(3).build());
        } else {
            system = adminGroupStoredList.get(AdminMenuGroupType.SYSTEM);
        }

        // adminMenuGroup 업데이트
        log.info("기존 관리자 메뉴 그룹 {}건 확인", adminGroupStoredList.size());
        log.info("누락된 기본 관리자 메뉴 그룹 {}건 추가됨", adminGroupList.size());
        adminMenuGroupRepository.saveAll(adminGroupList);
        // -------------------------------------------------------------------------------------------------------



        // DB에서 adminMenu 불러오기 -------------------------------------------------------------------------------
        Map<AdminMenuType, AdminMenu> adminMenuStoredList = new HashMap<>();
        adminMenuRepository.findAll().forEach(adminMenu -> {
            adminMenuStoredList.put(adminMenu.getCode(), adminMenu);
        });

        // 기존 adminMenu에 추가되어 있지 않은 내용이라면 menuList에 추가
        List<AdminMenu> adminMenuList = new ArrayList<>();
        if (!adminMenuStoredList.containsKey(AdminMenuType.INTRODUCTIONS)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.INTRODUCTIONS).group(homepage)
                    .orderSeq(1).icon("fas fa-handshake").codeDetail("INTRODUCTION").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.NOTICES)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.NOTICES).group(homepage)
                    .orderSeq(2).icon("fas fa-volume-down").codeDetail("NOTICE").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.JOBS)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.JOBS).group(recruit)
                    .orderSeq(3).icon("fas fa-exclamation-circle").codeDetail("JOB").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.APPLICANTS)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.APPLICANTS).group(recruit)
                    .orderSeq(4).icon("fas fa-id-badge").codeDetail("APPLICANT").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.INQUIRES)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.INQUIRES).group(recruit)
                    .orderSeq(5).icon("fas fa-question-circle").codeDetail("INQUIRY").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.ACCESS)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.ACCESS).group(system)
                    .orderSeq(6).icon("fas fa-sign-in-alt").build());
        }
        if (!adminMenuStoredList.containsKey(AdminMenuType.ACCOUNTS)) {
            adminMenuList.add(AdminMenu.builder(AdminMenuType.ACCOUNTS).group(system)
                    .orderSeq(7).icon("fas fa-users-cog").codeDetail("ACCOUNT").build());
        }

        // adminMenu 업데이트
        log.info("기존 관리자 메뉴 {}건 확인", adminMenuStoredList.size());
        log.info("누락된 기본 관리자 메뉴 {}건 추가됨", adminMenuList.size());
        adminMenuRepository.saveAll(adminMenuList);
        // -------------------------------------------------------------------------------------------------------
    }
}
