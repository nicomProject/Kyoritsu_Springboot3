package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.service.introductions.IntroductionsService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import lombok.RequiredArgsConstructor;

/**
 *  소개글에 대한 내용 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class IntroductionsController {
    private final IntroductionsService introductionsService;

    @RequestMapping(path = "/introductions/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(introductionsService.findAll());
    }
}
