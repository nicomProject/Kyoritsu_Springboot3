package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.InquiryParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.inquiry.InquiryService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  채용문의에 대한 요청을 받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class InquiryController {
    // field 정의
    private final InquiryService inquiryService;

    // [url] : /api/inquiry/find
    @RequestMapping(path = "/inquiry/find", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 24, desc = "[관리자/사용자] 채용문의 모두 조회")
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(inquiryService.findAll());
    }

    // [url] : /api/inquiry/findSelf/{key} (홈페이지용)
    @RequestMapping(path = "/inquiry/findSelf/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 25, desc = "[사용자] 특정 채용문의 조회")
    public ResponseHandler<?> findSelf(@PathVariable Long key) {
        return new ResponseHandler<>(inquiryService.findAll(key));
    }

    // [url] : /api/inquiry/findSelf (관리자 페이지용)
    @RequestMapping(path = "/inquiry/findSelf", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 26, desc = "[관리자] 특정 채용문의 조회")
    public ResponseHandler<?> findSelfAdmin(@RequestBody InquiryParam param) {
        return new ResponseHandler<>(inquiryService.findAll(param));
    }

    // [url] : /api/inquiry/findSelfPwd/{key}
    @RequestMapping(path = "/inquiry/findSelfPwd/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 27, desc = "[사용자] 특정 채용문의 비밀번호 조회")
    public ResponseHandler<?> findSelfPwd(@PathVariable Long key) {
        return new ResponseHandler<>(inquiryService.findAllSelfPwd(key));
    }

    // [url] : /api/inquiry/add
    @RequestMapping(value = "/inquiry/add", method = RequestMethod.POST)
    @ApiMapping(order = 28, desc = "[사용자] 채용문의 추가")
    public ResponseHandler<?> add(@RequestBody @Valid InquiryParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.add(param));
    }

    // [url] : /api/inquiry/addAnswer
    @RequestMapping(value = "/inquiry/addAnswer", method = RequestMethod.POST)
    @ApiMapping(order = 29, desc = "[관리자] 채용문의 답변 추가")
    public ResponseHandler<?> addAnswer(@RequestBody InquiryParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.addAnswer(param));
    }

    // [url] : /api/inquiry/update
    @RequestMapping(value = "/inquiry/update", method = RequestMethod.POST)
    @ApiMapping(order = 30, desc = "[사용자] 채용문의 업데이트")
    public ResponseHandler<?> update(@RequestBody @Valid InquiryParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.update(param));
    }

    // [url] : /api/inquiry/delete
    @RequestMapping(value = "/inquiry/delete", method = RequestMethod.POST)
    @ApiMapping(order = 30, desc = "[관리자] 채용문의 삭제")
    public ResponseHandler<?> delete(@RequestBody MultipleParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.delete(param));
    }

}
