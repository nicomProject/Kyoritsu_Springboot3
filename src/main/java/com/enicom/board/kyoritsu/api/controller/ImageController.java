package com.enicom.board.kyoritsu.api.controller;


import com.enicom.board.kyoritsu.api.service.image.ImageService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
@Slf4j
public class ImageController {

    private final ImageService imageService;

    @RequestMapping(path = "/image", method = {RequestMethod.POST})
    // @ApiMapping(order = 24, desc = "[자료실] 이미지
    //
    // 업로드", param = RoomInfoParam.class)
    public ResponseHandler<?> uploadRoomImage(Model model, MultipartHttpServletRequest request, @RequestPart String name, @RequestPart MultipartFile file) {
        model.addAttribute("path", request);
        return new ResponseHandler<>(imageService.upload(request, name, file));
    }

    @RequestMapping(path = "/image", method = {RequestMethod.GET})
    // @ApiMapping(order = 25, desc = "[자료실] 이미지 다운로드", param = RoomInfoParam.class)
    public void downloadRoomImage(HttpServletRequest request, HttpServletResponse response, @RequestParam(name = "name") String name) {
        imageService.download(request, response, name);
    }

    @RequestMapping(path = "/uploadImages", method = RequestMethod.POST)
    public String uploadImages(Model model, HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "images", required = false) MultipartFile[] images) {
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmssSSS");

        File folder = new File("./storage/images");
        if (images != null && !folder.exists()) {
            folder.mkdirs();
            log.info("폴더가 생성되었습니다. folder path: {}", folder);
        }

        try {
            if(images != null) {

            for (int i = 0; i < images.length; i++) {
                MultipartFile image = images[i];

                if (!image.isEmpty()) {
                    // 이미지 데이터를 바이트 배열로 가져옴
                    byte[] fileData = image.getBytes();

                    // 파일 이름을 생성
                    int randomNum = (int) (Math.random() * 9000) + 1000; // 4자리 난수
                    String fileName = "image" + sdf.format(timestamp) + "_" + randomNum + ".png";

                    // 파일을 서버에 저장
                    try {
                        // 이미지 데이터를 파일로 저장
                        String filePath = String.format("%s/%s", folder.getAbsolutePath(), fileName);
                        File file = new File(filePath);
                        FileOutputStream fos = new FileOutputStream(file);
                        fos.write(fileData);
                        fos.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    String imageUrl = fileName;

                    // 이미지 url 경로 반환
                    return imageUrl;
                }
            }
            }
            else {
                return "This image already exists";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Image upload failed";
        }
        return "It shouldn't be appeared!!!";
    }
}