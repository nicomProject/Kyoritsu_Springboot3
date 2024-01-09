package com.enicom.board.kyoritsu.api.controller;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.service.applicant.ApplicantService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  지원자의 데이터를 요청받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class ApplicantController {
    // field 정의
    private final ApplicantService applicantService;

    // [url] : /api/applicant/findWithJob/{key}
    @RequestMapping(path = "/applicant/findWithJob/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 13, desc = "[관리자] 특정 채용공고 기준 지원자들 조회")
    public ResponseHandler<?> findJob(@PathVariable Long key){
        return new ResponseHandler<>(applicantService.findApplicantWithJob(key));
    }

    // [url] : /api/applicant/findSelf/{key}
    @RequestMapping(path = "/applicant/findSelf/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 14, desc = "[관리자] 특정 지원자 정보 조회")
    public ResponseHandler<?> findSelf(@PathVariable Long key){
        return new ResponseHandler<>(applicantService.findAll(key));
    }

    // [url] : /api/applicant/add
    @RequestMapping(value = "/applicant/add", method = RequestMethod.POST)
    @ApiMapping(order = 15, desc = "[관리자] 특정 지원자 합불결과 작성")
    public ResponseHandler<?> Add(@RequestBody ApplicantParam param) throws Exception {
        return new ResponseHandler<>(applicantService.add(param));
    }

    // [url] : /api/applicant/apply
    @RequestMapping(value = "/applicant/apply", method = RequestMethod.POST)
    @ApiMapping(order = 16, desc = "[사용자] 지원서 제출")
    public ResponseHandler<?> Apply(@RequestBody @Valid ApplicantParam param) throws Exception {
        return new ResponseHandler<>(applicantService.apply(param));
    }

    // [url] : /api/applicant/apply_files
    @RequestMapping(value = "/applicant/apply_files", method = RequestMethod.POST)
    @ApiMapping(order = 17, desc = "[사용자] 지원서 프로필 및 첨부파일 제출")
    public ResponseHandler<?> ApplyFiles(@RequestPart("recKey") String recKey, @RequestPart("name") String applicantName, @RequestPart("profile") MultipartFile profile, @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
        return new ResponseHandler<>(applicantService.applyFiles(Long.parseLong(recKey), applicantName, profile, files));
    }
}
