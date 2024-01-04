package com.enicom.board.kyoritsu.api.service.file;

import com.enicom.board.kyoritsu.api.param.file.FileInfoParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.FileVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.utils.FileUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;


public class FileService {
    /**
     * [파일 관리] 파일 목록 조회
     *
     * @param param 조회할 정보 파라미터
     * @return 파일 목록
     */
    public static PageVO<FileVO> getList(FileInfoParam param) {
        String path = param.getFolder();
        String name = param.getName();
        return PageVO.builder(FileUtil.getFileList(path, name)).build();
    }

    /**
     * [파일 관리] 파일 업로드
     *
     * @param folder     요청할 Path
     * @param uploadFile 업로드할 파일
     * @param uploadName 업로드 파일명
     * @return 응답 결과
     */
    public static ResponseDataValue<String> upload(String folder, MultipartFile uploadFile, String uploadName) {
        String fileName = FileUtil.uploadFile(folder, uploadFile, uploadName);
        if (fileName == null) {
            return ResponseDataValue.<String>builder(400).result("").desc("업로드 중 오류가 발생하였습니다. 오류 발생원인 (파일 확장자, 한글 깨짐)").build();
        }
        return ResponseDataValue.<String>builder(200).result(fileName).desc("성공적으로 업로드되었습니다.").build();
    }

    /**
     * [파일 관리] 파일 삭제
     *
     * @param path  요청 정보
     * @param param 요청하는 File 정보
     * @return 응답 결과
     */
    public static ResponseDataValue<?> delete(String path, FileInfoParam param) {
        String name = param.getName();
        if (FileUtil.deleteFile(path, name) > 0) {
            return ResponseDataValue.builder(200).build();
        }
        return ResponseDataValue.builder(400).build();
    }

    /**
     * [파일 관리] 파일 다운로드
     *
     * @param request  요청 정보
     * @param response 응답 정보
     * @param param    요청하는 File 정보
     */
    public static boolean download(HttpServletRequest request, HttpServletResponse response, String path, FileInfoParam param) {
        String name = param.getName();
        return FileUtil.downloadFile(request, response, path, name);
    }
}
