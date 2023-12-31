package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.param.JobParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.job.JobService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  채용공고 대한 내용 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class JobController {
    private final JobService jobService;
    
    @RequestMapping(value = "/job/find", method = RequestMethod.GET)
    public ResponseHandler<?> find() throws Exception {
        return new ResponseHandler<>(jobService.findAll());
    }

    @RequestMapping(value = "/job/findSelf", method = RequestMethod.POST)
    public ResponseHandler<?> findSelf(@RequestBody @Valid JobParam param) throws Exception {
        return new ResponseHandler<>(jobService.findAll(param));
    }

    @RequestMapping(value = "/job/search", method=RequestMethod.POST)
    public ResponseHandler<?> findSearch(@RequestBody @Valid JobParam param) {
        return new ResponseHandler<>(jobService.findSearch(param));
    }
    
    @RequestMapping(value = "/job/add", method = RequestMethod.POST)
    public ResponseHandler<?> add(@RequestBody @Valid JobParam param) throws Exception {
        return new ResponseHandler<>(jobService.add(param));
    }

    @RequestMapping(value = "/job/update", method = RequestMethod.POST)
    public ResponseHandler<?> update(@RequestBody @Valid JobParam param) throws Exception {
        return new ResponseHandler<>(jobService.update(param));
    }

    @RequestMapping(value = "/job/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(jobService.delete(param));
    }

    @RequestMapping(path = "/job/findCategorySelf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findCategorySelf(@RequestBody JobParam param) {
        return new ResponseHandler<>(jobService.findAllCategory(param));
    }
}
