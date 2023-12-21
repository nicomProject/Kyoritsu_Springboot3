package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.service.notice.NoticeService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import lombok.RequiredArgsConstructor;

/**
 *  공지사항에 대한 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class NoticeController {
    private final NoticeService noticeService;

    // [url] : /api/notice/find
    // Notice entity중 delete_date=null인 record들을 create_date 내림차순으로 정렬하여 반환
    @RequestMapping(path = "/notice/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(noticeService.findAll());
    }
}
