package com.enicom.board.kyoritsu.api.controller;

import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.service.applicant.ApplicantService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class ApplicantController {
    private final ApplicantService applicantService;

    @RequestMapping(path = "/applicant/findWithJob/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findJob(@PathVariable Long key){
        return new ResponseHandler<>(applicantService.findApplicantWithJob(key));
    }

    @RequestMapping(path = "/applicant/findSelf/{key}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@PathVariable Long key){
        return new ResponseHandler<>(applicantService.findAll(key));
    }

    @RequestMapping(value = "/applicant/add", method = RequestMethod.POST)
    public ResponseHandler<?> Add(@RequestBody @Valid ApplicantParam param) throws Exception {
        return new ResponseHandler<>(applicantService.add(param));
    }

    @RequestMapping(value = "/applicant/apply", method = RequestMethod.POST)
    public ResponseHandler<?> Apply(@RequestBody @Valid ApplicantParam param) throws Exception {
        return new ResponseHandler<>(applicantService.apply(param));
    }

    @RequestMapping(value = "/applicant/apply_files", method = RequestMethod.POST)
    public ResponseHandler<?> ApplyFiles(@RequestPart("profile") MultipartFile profile, @RequestPart("files") MultipartFile[] files) throws Exception {
        System.out.println("profile: "+profile);
        System.out.println("files: "+files);
        return new ResponseHandler<>(200);
        // return new ResponseHandler<>(applicantService.applyFiles(param));
    }
}
