package com.enicom.board.kyoritsu.api.controller;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.UUID;

/**
 *  이미지 업로드 요청을 받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
@Slf4j
public class ImageController {

    @RequestMapping(path = "/uploadImages", method = RequestMethod.POST)
    @ApiMapping(order = 23, desc = "[관리자] 각종 게시글 이미지 업로드")
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

    @RequestMapping(value="/smarteditorMultiImageUpload")
	public void smarteditorMultiImageUpload(HttpServletRequest request, HttpServletResponse response){
		try {
			//파일정보
			String sFileInfo = "";
			//파일명을 받는다 - 일반 원본파일명
			String sFilename = request.getHeader("file-name");
			//파일 확장자
			String sFilenameExt = sFilename.substring(sFilename.lastIndexOf(".")+1);
			//확장자를소문자로 변경
			sFilenameExt = sFilenameExt.toLowerCase();
				
			//이미지 검증 배열변수
			String[] allowFileArr = {"jpg","png","bmp","gif"};

			//확장자 체크
			int nCnt = 0;
			for(int i=0; i<allowFileArr.length; i++) {
				if(sFilenameExt.equals(allowFileArr[i])){
					nCnt++;
				}
			}

			//이미지가 아니라면
			if(nCnt == 0) {
				PrintWriter print = response.getWriter();
				print.print("NOTALLOW_"+sFilename);
				print.flush();
				print.close();
			} else {
				//디렉토리 설정 및 업로드	
				
				//파일경로
				String filePath = "./storage/images/";
				File file = new File(filePath);
				
				if(!file.exists()) {
					file.mkdirs();
				}
				
				String sRealFileNm = "";
				SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
				String today= formatter.format(new java.util.Date());
				sRealFileNm = today+UUID.randomUUID().toString() + sFilename.substring(sFilename.lastIndexOf("."));
				String rlFileNm = filePath + sRealFileNm;
				
				// 서버에 파일쓰기
				InputStream inputStream = request.getInputStream();
				OutputStream outputStream=new FileOutputStream(rlFileNm);
				int numRead;
				byte bytes[] = new byte[Integer.parseInt(request.getHeader("file-size"))];
				while((numRead = inputStream.read(bytes,0,bytes.length)) != -1){
					outputStream.write(bytes,0,numRead);
				}
				if(inputStream != null) {
					inputStream.close();
				}
				outputStream.flush();
				outputStream.close();
				
				// 정보 작성
				sFileInfo += "&bNewLine=true";
				sFileInfo += "&sFileName="+ sFilename;
				sFileInfo += "&sFileURL=/"+filePath+sRealFileNm;
				PrintWriter printWriter = response.getWriter();
				printWriter.print(sFileInfo);
				printWriter.flush();
				printWriter.close();
			}	
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}