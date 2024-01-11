package com.enicom.board.kyoritsu.api.controller;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;

import jakarta.servlet.http.HttpServletResponse;

/**
 *  첨부파일 및 이미지 다운로드 요청을 받고 처리함.
**/

@Controller
@RequestMapping(path = "/storage")
public class FileDownloadController {

    // [url] : /storage/profiles/{applicantIdName}/{fileName}
    @GetMapping("/profiles/{applicantIdName}/{fileName}")
    @ApiMapping(order = 20, desc = "[관리자] 지원자 프로필 다운로드")
    public void downloadProfile(@PathVariable("applicantIdName") String applicantIdName, @PathVariable("fileName") String fileName, HttpServletResponse response) throws IOException {

        String path = "storage/profiles/"+applicantIdName+"/"+fileName;
    
        byte[] fileByte = FileUtils.readFileToByteArray(new File(path));

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(fileName, "UTF-8")+"\";");
        response.setHeader("Content-Transfer-Encoding", "binary");

        response.getOutputStream().write(fileByte);
        response.getOutputStream().flush();
        response.getOutputStream().close();
    }

    // [url] : /storage/files/{applicantIdName}/{fileName}
    @GetMapping("/files/{applicantIdName}/{fileName}")
    @ApiMapping(order = 21, desc = "[관리자] 지원자 첨부파일 다운로드")
    public void downloadFile(@PathVariable("applicantIdName") String applicantIdName, @PathVariable("fileName") String fileName, HttpServletResponse response) throws IOException {

        String path = "storage/files/"+applicantIdName+"/"+fileName;
    
        byte[] fileByte = FileUtils.readFileToByteArray(new File(path));

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(fileName, "UTF-8")+"\";");
        response.setHeader("Content-Transfer-Encoding", "binary");

        response.getOutputStream().write(fileByte);
        response.getOutputStream().flush();
        response.getOutputStream().close();
    }

    // [url] : /storage/images/{fileName}
    @GetMapping("/images/{fileName}")
    @ApiMapping(order = 22, desc = "[관리자/사용자] 게시글 이미지 다운로드")
    public void downloadImages(@PathVariable("fileName") String fileName, HttpServletResponse response) throws IOException {

        String path = "storage/images/"+fileName;
    
        byte[] fileByte = FileUtils.readFileToByteArray(new File(path));

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(fileName, "UTF-8")+"\";");
        response.setHeader("Content-Transfer-Encoding", "binary");

        response.getOutputStream().write(fileByte);
        response.getOutputStream().flush();
        response.getOutputStream().close();
    }
}