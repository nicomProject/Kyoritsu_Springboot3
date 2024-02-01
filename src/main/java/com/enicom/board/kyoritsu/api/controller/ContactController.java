package com.enicom.board.kyoritsu.api.controller;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.param.CodeParam;
import com.enicom.board.kyoritsu.api.param.ContactParam;
import com.enicom.board.kyoritsu.api.service.applicant.ApplicantService;
import com.enicom.board.kyoritsu.api.service.contact.ContactService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 *  지원자의 데이터를 요청받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class ContactController {
    // field 정의
    private final ContactService contactService;

    // [url] : /api/applicant/add
    @RequestMapping(value = "/contact/add", method = RequestMethod.POST)
    @ApiMapping(order = 15, desc = "[사용자] 문의사항 작성")
    public ResponseHandler<?> Add(@RequestBody ContactParam param) throws Exception {
        return new ResponseHandler<>(contactService.add(param));
    }
}
