package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.CodeParam;
import com.enicom.board.kyoritsu.api.service.adminSetting.AdminSettingService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  관리자 페이지의 데이터를 요청받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/adm/setting")
public class AdminSettingController {
    // field 정의
    private final AdminSettingService adminSettingService;

    // [url] : /api/adm/setting/menus
    @RequestMapping(path = "/menus", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 1, desc = "[관리자] 관리자 메뉴 목록 조회")
    public ResponseHandler<?> getAdminMenuList() {
        return new ResponseHandler<>(adminSettingService.getAdminMenuList());
    }

    // [url] : /api/adm/setting/roles
    @RequestMapping(path = "/roles", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 2, desc = "[관리자] 현재 관리자 역할 조회")
    public ResponseHandler<?> getRoleList() {
        return new ResponseHandler<>(adminSettingService.getRoleList());
    }

    // [url] : /api/adm/setting/allRoles
    @RequestMapping(path = "/allRoles", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 3, desc = "[관리자] 모든 관리자 역할 조회")
    public ResponseHandler<?> getAllRoleList() {
        return new ResponseHandler<>(adminSettingService.getAllRoleList());
    }

    // [url] : /api/adm/setting/initPwd (GET)
    @RequestMapping(path = "/initpwd", method = {RequestMethod.GET})
    @ApiMapping(order = 4, desc = "[관리자] 초기 비밀번호 조회")
    public ResponseHandler<?> getInitPwd() {
        return new ResponseHandler<>(adminSettingService.getInitPwd());
    }

    // [url] : /api/adm/setting/initPwd (POST)
    @RequestMapping(path = "/initpwd", method = {RequestMethod.POST})
    @ApiMapping(order = 5, desc = "[관리자] 초기 비밀번호 변경", param = CodeParam.class)
    public ResponseHandler<?> setInitPwd(@RequestBody @Valid CodeParam param) {
        return new ResponseHandler<>(adminSettingService.setInitPwd(param));
    }
}
