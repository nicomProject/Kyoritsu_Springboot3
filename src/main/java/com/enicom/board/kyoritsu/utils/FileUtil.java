package com.enicom.board.kyoritsu.utils;

import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.FileVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
public class FileUtil {
    /**
     * [FileUtil] 특정 경로(path)에 있는 파일 목록 불러오기
     *
     * @param path
     * @return
     * @throws IOException
     */
    public static List<FileVO> getFileList(String path, String searchName) {
        List<FileVO> resultList = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        File dir = new File(path);
        if (!dir.exists()) {
            // 경로가 없을 경우 생성
            dir.mkdirs();
            log.error("해당 경로가 없어 생성하였습니다. path: {}", path);
            return Collections.emptyList();
        }

        // 파일명 필터
        File[] files = dir.listFiles((dir1, name) -> name.contains(searchName));
        BasicFileAttributes attrs;

        for (File file : files) {
            // 폴더인 경우 pass
            if (file.isDirectory())
                continue;

            try {
                attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
            } catch (IOException e) {
                log.error("I/O 작업중 에러가 발생하였습니다. msg: {}", e.getMessage());
                e.printStackTrace();
                return Collections.emptyList();
            }
            FileTime createDate = attrs.creationTime();
            FileTime editDate = attrs.lastModifiedTime();
            FileTime accessDate = attrs.lastAccessTime();

            resultList.add(FileVO.builder()
                    .name(file.getName())
                    .path(file.getPath())
                    .size(file.length())
                    .createDate(convertLocalDateTimeBy(createDate))
                    .editDate(convertLocalDateTimeBy(editDate))
                    .accessDate(convertLocalDateTimeBy(accessDate))
                    .build());
        }

        return resultList;
    }

    public static LocalDateTime convertLocalDateTimeBy(FileTime time) {
        return LocalDateTime.ofInstant(time.toInstant(), ZoneId.systemDefault());
    }

    /**
     * [FileUtil] 파일 업로드
     *
     * @param path       파일 경로
     * @param uploadFile 업로드할 파일
     * @param uploadName 파일명 (확장자 미포함)
     * @return 업로드 파일명 (확장자 포함)
     */
    public static String uploadFile(String path, MultipartFile uploadFile, String uploadName) {
        String result = "";

        // files 폴더는 직접 생성해주지 않으면 Not Found Error.
        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs();
            log.info("폴더가 생성되었습니다. folder path: {}", folder);
        }

        String fileName = uploadFile.getOriginalFilename();
        String fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);

        // 웹 쉘 확장자를 가진 경우
        String[] candidates = {"jpg", "png", "jpeg"};
        if (Arrays.stream(candidates).noneMatch(ext -> ext.equalsIgnoreCase(fileExt))) {
            log.info("denied file ext: {}", fileExt);
            return null;
        }

        byte[] bytes;
        try {
            bytes = uploadFile.getBytes();
        } catch (IOException e) {
            log.error("파일 Byte 변환시 Error 발생: {}", e.getMessage());
            e.printStackTrace();
            return null;
        }

        if (uploadName.isEmpty()) {
            return null;
        }

        // PNG 파일로만 저장
        result = String.format("%s.png", uploadName);
        String filePath = String.format("%s/%s", folder.getAbsolutePath(), result);

        // 파일 생성
        File file = new File(filePath);
        // 파일이 존재할 경우 덮어쓰기
        if (file.exists()) {
            // 실행 가능한 파일이면 실행권한 제거
            if (file.canExecute()) {
                file.setExecutable(false);
            }
        }
        try (OutputStream out = Files.newOutputStream(file.toPath())) {
            out.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return result;
    }

    public static ResponseDataValue<?> renameFile(String path, String origin, String change) {
        File file = new File(String.format("%s\\%s", path, origin));
        if (!file.exists() || !file.isFile() || !file.canRead()) {
            log.error("File에 접근할 수 없습니다. 존재여부: {}, 파일여부: {}, 권한여부: {}", file.exists(), file.isFile(), file.canRead());
            return ResponseDataValue.builder(400).desc("파일이 없거나 읽을 수 없습니다").build();
        }

        File newFile = new File(String.format("%s\\%s", path, change));
        if (file.renameTo(newFile)) {
            return ResponseDataValue.builder(200).desc("파일명이 성공적으로 수정되었습니다.").build();
        } else if (newFile.exists()) {
            return ResponseDataValue.builder(400).desc("이미 있는 파일명으로 수정할 수 없습니다.").build();
        }

        return ResponseDataValue.builder(400).build();
    }

    public static ResponseDataValue<?> writeFile(String fileName, String content) {
        File file = new File(fileName);

        // 파일이 존재할 경우 덮어쓰기
        if (file.exists()) {
            file = new File(fileName);

            // 실행 가능한 파일이면 실행권한 제거
            if (file.canExecute()) {
                file.setExecutable(false);
            }
        }

        try (OutputStream out = Files.newOutputStream(file.toPath())) {
            out.write(content.getBytes(StandardCharsets.UTF_8));

        } catch (IOException e) {
            return ResponseDataValue.builder(400).desc(e.getMessage()).build();
        }

        return ResponseDataValue.builder(200).build();
    }

    /**
     * [FileUtil] 파일 삭제
     *
     * @param path     파일 경로
     * @param fileName 파일명
     * @return delete 여부
     */
    public static int deleteFile(String path, String fileName) {
        int count = 0;

        File file = new File(String.format("%s\\%s", path, fileName));
        if (file.exists()) {
            if (file.delete()) {
                count++;
            }
        }

        return count;
    }

    public static boolean downloadFile(HttpServletRequest request, HttpServletResponse response, String path,
                                       String fileName) {
        File file = new File(String.format("%s\\%s", path, fileName));
        if (!file.exists() || !file.isFile() || !file.canRead()) {
            log.error("File에 접근할 수 없습니다. 존재여부: {}, 파일여부: {}, 권한여부: {}", file.exists(), file.isFile(), file.canRead());
            return false;
        }

        response.setContentType("application/octet-stream; charset=utf-8");
        response.setContentLength((int) file.length());

        try (OutputStream out = response.getOutputStream(); FileInputStream fis = new FileInputStream(file)) {
            String browser = getBrowser(request);
            String disposition = getDisposition(fileName, browser);
            response.setHeader("Content-Disposition", disposition);
            response.setHeader("Content-Transfer-Encoding", "binary");

            FileCopyUtils.copy(fis, out);
        } catch (IOException e) {
            log.error("File 다운로드 중 에러가 발생하였습니다. Message: {}", e.getMessage());
            throw new RuntimeException(e);
        }

        return true;
    }

    private static String getBrowser(HttpServletRequest request) {
        String header = request.getHeader("User-Agent");
        if (header.contains("MSIE") || header.contains("Trident"))
            return "MSIE";
        else if (header.contains("Chrome"))
            return "Chrome";
        else if (header.contains("Opera"))
            return "Opera";
        return "Firefox";
    }

    private static String getDisposition(String filename, String browser) throws UnsupportedEncodingException {
        String dispositionPrefix = "attachment;filename=";
        String encodedFilename = null;
        switch (browser) {
            case "MSIE":
                encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
                break;
            case "Firefox":
                encodedFilename = String.format("\"%s\"", new String(filename.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1));
                break;
            case "Opera":
                encodedFilename = String.format("\"%s\"", new String(filename.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8));
                break;
            case "Chrome":
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < filename.length(); i++) {
                    char c = filename.charAt(i);
                    if (c > '~') {
                        sb.append(URLEncoder.encode(String.valueOf(c), "UTF-8"));
                    } else {
                        sb.append(c);
                    }
                }
                encodedFilename = sb.toString();
                break;
        }
        return dispositionPrefix + encodedFilename;
    }

    public static String getRealPath(HttpServletRequest request, String path) {
        return request.getSession().getServletContext().getRealPath(path);
    }
}