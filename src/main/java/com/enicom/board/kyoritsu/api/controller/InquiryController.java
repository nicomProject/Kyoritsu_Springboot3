package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.param.InquiryParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.inquiry.InquiryService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  채용문의에 대한 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class InquiryController {
    // field 정의
    private final InquiryService inquiryService;

    // [url] : /api/inquiry/find
    // Inquiry entity중 delete_date=null인 record들을 create_date 내림차순으로 정렬하여 반환
    @RequestMapping(path = "/inquiry/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(inquiryService.findAll());
    }

    // [url] : /api/inquiry/findSelf/{key}
    @RequestMapping(path = "/inquiry/findSelf/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@PathVariable Long key) {
        return new ResponseHandler<>(inquiryService.findAll(key));
    }

    // [url] : /api/inquiry/findSelfPwd/{key}
    @RequestMapping(path = "/inquiry/findSelfPwd/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelfPwd(@PathVariable Long key) {
        return new ResponseHandler<>(inquiryService.findAllSelfPwd(key));
    }

    // [url] : /api/inquiry/add
    // Inquiry param을 받아서 Inquiry entity 추가함
    @RequestMapping(value = "/inquiry/add", method = RequestMethod.POST)
    public ResponseHandler<?> add(@RequestBody @Valid InquiryParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.add(param));
    }


    // [url] : /api/inquiry/update
    @RequestMapping(value = "/inquiry/update", method = RequestMethod.POST)
    public ResponseHandler<?> update(@RequestBody @Valid InquiryParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.update(param));
    }

    // [url] : /api/inquiry/delete
    @RequestMapping(value = "/inquiry/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(inquiryService.delete(param));
    }

}
