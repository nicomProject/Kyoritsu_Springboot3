package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.param.NoticeParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.notice.NoticeService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  공지사항에 대한 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class NoticeController {
    // field 정의
    private final NoticeService noticeService;

    // [url] : /api/notice/add
    @RequestMapping(path = "/notice/add", method = RequestMethod.POST)
    public ResponseHandler<?> add(@RequestBody @Valid NoticeParam param) {
        return new ResponseHandler<>(noticeService.add(param));
    }

    // [url] : /api/notice/find
    // Notice entity중 delete_date=null인 record들을 create_date 내림차순으로 정렬하여 반환
    @RequestMapping(path = "/notice/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() {
        return new ResponseHandler<>(noticeService.findAll());
    }

    // [url] : /api/notice/findSelf
    @RequestMapping(path = "/notice/findSelf", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@RequestBody NoticeParam param) {
        return new ResponseHandler<>(noticeService.findAll(param));
    }

    // [url] : /api/notice/detail/{recKey}
    @RequestMapping(path = "/notice/detail/{recKey}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> findSelf(@PathVariable Long recKey){
        return new ResponseHandler<>(noticeService.findBy(recKey));
    }

    // [url] : /api/notice/update
    @RequestMapping(value = "/notice/update", method = RequestMethod.POST)
    public ResponseHandler<?> update(@RequestBody @Valid NoticeParam param) throws Exception {
        return new ResponseHandler<>(noticeService.update(param));
    }

    // [url] : /api/notice/delete
    @RequestMapping(value = "/notice/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(noticeService.delete(param));
    }
}
