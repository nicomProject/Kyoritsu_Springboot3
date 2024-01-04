package com.enicom.board.kyoritsu.api.service.image;

import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ImageService {

    ResponseDataValue<?> upload(MultipartHttpServletRequest request, String name, MultipartFile file);

    void download(HttpServletRequest request, HttpServletResponse response, String name);



}
