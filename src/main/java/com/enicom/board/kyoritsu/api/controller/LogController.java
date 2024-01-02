package com.enicom.board.kyoritsu.api.controller;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.service.log.LogService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/adm/log")
public class LogController {
    private final LogService logService;

    @RequestMapping(path = "/access", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> getAccessLogList(){
        return new ResponseHandler<>(logService.getAccessLogList());
    }

    @RequestMapping(path = "/access/delete", method = RequestMethod.POST)
    public ResponseHandler<?> deleteAccessLogList(@RequestBody @Valid MultipleParam param) throws Exception {
        return new ResponseHandler<>(logService.deleteAccessLogList(param));
    }
}
