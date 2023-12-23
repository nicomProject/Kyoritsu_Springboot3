package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.service.adminSetting.AdminSettingService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import lombok.RequiredArgsConstructor;

/**
 *  관리자 페이지에 관련한 데이터를 요청받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/adm/setting")
public class AdminSettingController {
    private final AdminSettingService adminSettingService;

    @RequestMapping(path = "/menus", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 60, desc = "관리자 메뉴 목록 조회")
    public ResponseHandler<?> getAdminMenuList() {
        return new ResponseHandler<>(adminSettingService.getAdminMenuList());
    }

    @RequestMapping(path = "/roles", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 70, desc = "현재 관리자 역할 조회")
    public ResponseHandler<?> getRoleList() {
        return new ResponseHandler<>(adminSettingService.getRoleList());
    }

    @RequestMapping(path = "/allRoles", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 70, desc = "모든 관리자 역할 조회")
    public ResponseHandler<?> getAllRoleList() {
        return new ResponseHandler<>(adminSettingService.getAllRoleList());
    }
}
