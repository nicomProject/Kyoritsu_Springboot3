package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.param.IntroductionsParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.introductions.IntroductionsService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  소개글에 대한 내용 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class IntroductionsController {
    private final IntroductionsService introductionsService;

    @RequestMapping(value = "/introductions/add", method = RequestMethod.POST)
    public ResponseHandler<?> add(@RequestBody @Valid IntroductionsParam param) throws Exception {
        return new ResponseHandler<>(introductionsService.add(param));
    }

    @RequestMapping(path = "/introductions/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(introductionsService.findAll());
    }

    @RequestMapping(path = "/introductions/findSelf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@RequestBody IntroductionsParam param){
        return new ResponseHandler<>(introductionsService.findAll(param));
    }

    @RequestMapping(value = "/introductions/update", method = RequestMethod.POST)
    public ResponseHandler<?> update(@RequestBody @Valid IntroductionsParam param) throws Exception {
        return new ResponseHandler<>(introductionsService.update(param));
    }

    @RequestMapping(value = "/introductions/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(introductionsService.delete(param));
    }

    @RequestMapping(value = "/introductions/check", method = RequestMethod.POST)
    public ResponseHandler<?> check(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(introductionsService.check(param));
    }
}
