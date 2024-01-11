package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.service.category.CategoryService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 *  채용공고 지원분야에 대한 요청을 받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class CategoryController {
    // field 정의
    private final CategoryService categoryService;
    
    // [url] : /api/category/find
    @RequestMapping(value = "/category/find", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 18, desc = "[관리자/사용자] 채용공고 지원분야 전체 조회")
    public ResponseHandler<?> find() throws Exception {
        return new ResponseHandler<>(categoryService.findAll());
    }

    // [url] : /api/category/add
    @RequestMapping(value = "/category/add", method = RequestMethod.POST)
    @ApiMapping(order = 19, desc = "[관리자] 채용공고 지원분야 추가")
    public ResponseHandler<?> add(@RequestBody @Valid CategoryParam param) throws Exception {
        return new ResponseHandler<>(categoryService.add(param));
    }

    // [url] : /api/category/delete
    @RequestMapping(value = "/category/delete", method = RequestMethod.POST)
    @ApiMapping(order = 20, desc = "[관리자] 채용공고 지원분야 삭제")
    public ResponseHandler<?> delete(@RequestBody @Valid CategoryParam param) throws Exception {
        return new ResponseHandler<>(categoryService.delete(param));
    }
}
