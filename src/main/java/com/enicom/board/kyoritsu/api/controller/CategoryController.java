package com.enicom.board.kyoritsu.api.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.service.category.CategoryService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
/**
 *  채용공고 카테고리에 대한 내용 요청을 받고 처리함
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class CategoryController {
    private final CategoryService categoryService;
    
    @RequestMapping(value = "/category/find", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> find() throws Exception {
        return new ResponseHandler<>(categoryService.findAll());
    }

    @RequestMapping(value = "/category/add", method = RequestMethod.POST)
    public ResponseHandler<?> add(@RequestBody @Valid CategoryParam param) throws Exception {
        return new ResponseHandler<>(categoryService.add(param));
    }

    @RequestMapping(value = "/category/delete", method = RequestMethod.POST)
    public ResponseHandler<?> delete(@RequestBody @Valid CategoryParam param) throws Exception {
        return new ResponseHandler<>(categoryService.delete(param));
    }
}
