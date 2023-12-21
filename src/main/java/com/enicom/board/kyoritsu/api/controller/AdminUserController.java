package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.AdminUserInfoParam;
import com.enicom.board.kyoritsu.api.param.AdminUserPasswordParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.adminUser.AdminUserService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class AdminUserController {
    // field 정의
    private final AdminUserService adminUserService;

    // [url] : /api/managers
    @RequestMapping(path = "/managers", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 50, desc = "[관리자] 관리자 목록 조회")
    public ResponseHandler<?> getAdminUserList() {
        return new ResponseHandler<>(adminUserService.findAll());
    }

    // [url] : /api/manager/add
    @RequestMapping(path = "/manager/add", method = {RequestMethod.POST})
    @ApiMapping(order = 51, desc = "[관리자] 관리자 추가", param = AdminUserInfoParam.class)
    public ResponseHandler<?> addAdminUserInfo(@RequestBody @Valid AdminUserInfoParam param) {
        return new ResponseHandler<>(adminUserService.add(param));
    }

    // [url] : /api/manager/findSelf
    @ApiMapping(order = 52, desc = "[관리자] 특정 관리자 조회", param = AdminUserInfoParam.class)
    @RequestMapping(path = "/manager/findSelf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@RequestBody AdminUserInfoParam param) {
        return new ResponseHandler<>(adminUserService.findAll(param));
    }

    // [url] : /api/manager/update
    @ApiMapping(order = 53, desc = "[관리자] 특정 관리자 업데이트", param = AdminUserInfoParam.class)
    @RequestMapping(value = "/manager/update", method = RequestMethod.POST)
    public ResponseHandler<?> update(@RequestBody @Valid AdminUserInfoParam param) throws Exception {
        return new ResponseHandler<>(adminUserService.modify(param));
    }

    // [url] : /api/manager/update
    @ApiMapping(order = 54, desc = "[관리자] 특정 관리자 삭제", param = AdminUserInfoParam.class)
    @RequestMapping(value = "/manager/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(adminUserService.delete(param));
    }

    // [url] : /api/manager/mypassword
    @RequestMapping(path = "/manager/mypassword", method = {RequestMethod.POST})
    @ApiMapping(order = 55, desc = "[관리자] 관리자 비밀번호 변경", param = AdminUserPasswordParam.class)
    public ResponseHandler<?> changePassword(@RequestBody @Valid AdminUserPasswordParam param) {
        return new ResponseHandler<>(adminUserService.changePassword(param));
    }
}
