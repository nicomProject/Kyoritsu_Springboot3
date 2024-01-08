package com.enicom.board.kyoritsu.api.controller;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


import jakarta.servlet.http.HttpServletResponse;

/**
 *  첨부파일 다운로드에 사용되는 컨트롤러
**/

@Controller
@RequestMapping(path = "/storage")
public class FileDownloadController {
    @GetMapping("/profiles/{applicantIdName}/{fileName}")
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

    @GetMapping("/files/{applicantIdName}/{fileName}")
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
}