package com.enicom.board.kyoritsu.api.type;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder.Default;

/**
 *  status, result, code, desc를 포함한 ResponseDataValue를 정의. 
 *  makeMessage()로 desc를 code별로 변환해 주기 위해 custom builder를 정의.
 *  JSON 객체를 문자열로 표현하기 위해 toString() 재정의.
**/

@Builder
@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_EMPTY) // 해당 필드의 값이 null이거나 empty라면 해당 필드를 Json으로 변환하지 않도록 함
public class ResponseDataValue<T> {
    // field 정의
    @Default
    private HttpStatus status = HttpStatus.OK;
    @Default
    private T result = null;
    @Default
    private int code = 200;
    @Default
    private String desc = "성공적으로 처리되었습니다.";

    // custom builder 정의
    private static <T> ResponseDataValueBuilder<T> builder() {
        return new ResponseDataValueBuilder<>();
    }
    public static <T> ResponseDataValueBuilder<T> builder(int code) {
        return ResponseDataValue.<T>builder().code(code).desc(makeMessage(code));
    }
    public static <T> ResponseDataValueBuilder<T> builder(int code, T result) {
        return ResponseDataValue.<T>builder().code(code).desc(makeMessage(code)).result(result);
    }

    // code를 description으로 변환해주는 함수
    public static String makeMessage(int code) {
        String msg = String.valueOf(code);

        // success types
        if (code == 0) {
            msg = "시스템에 문제가 발생하였습니다.\r\n관리자에게 문의해 주시기 바랍니다.";
        } else if (code == 200) {
            msg = "성공적으로 처리되었습니다.";
        } else if (code == 201) {
            msg = "비밀번호가 성공적으로 변경되었습니다!\r\n변경된 비밀번호로 다시 로그인해주세요!";
        } else if (code == 210) {
            msg = "조회 결과가 없습니다.";
        } else if (code == 220) {
            msg = "로그인에 성공하였습니다.";
        } else if (code == 221) {
            msg = "초기 비밀번호로 로그인하였습니다.\r\n비밀번호를 변경해주십시오";

        // failure types
        } else if (code == 400) {
            msg = "처리 중 오류가 발생하였습니다.";
        } else if (code == 401) {
            msg = "처리중 오류가 발생하였습니다. (올바른 JSON 형식인지 확인해주세요.)";
        } else if (code == 402) {
            msg = "처리중 오류가 발생하였습니다. (올바른 파일 형식인지 확인해주세요.)";
        } else if (code == 403) {
            msg = "해당 지원분야가 이미 존재합니다.";
        } else if (code == 404) {
            msg = "입력하신 지원분야가 존재하지 않습니다.";
        }
        else if (code == 409) {
            msg = "해당 아이디를 가진 관리자가 존재합니다. (다른 아이디를 사용해 주세요.)";
        } else if (code == 410) {
            msg = "필수 파라미터 값이 누락되었습니다.";
        } else if (code == 420) {
            msg = "잘못된 아이디 또는 패스워드입니다.";
        } else if (code == 421) {
            msg = "로그인 세션 정보가 없습니다.";
        } else if (code == 440) {
            msg = "잘못된 데이터 유형입니다.";
        } else if (code == 441) {
            msg = "수정할 권한이 없습니다. 관리자에게 문의하십시오.";
        } else if (code == 450) {
            msg = "잘못된 파일입니다.";
        } else if (code == 480) {
            msg = "로그인에 실패하였습니다.\r\n아이디 또는 비밀번호를 확인해주세요.";
        } else if (code == 481) {
            msg = "세션이 만료되었습니다. 로그인 페이지로 이동합니다.";
        }

        return msg;
    }
    
    // JSON 객체 문자열 표현을 위한 toString() 재정의
    @Override
    public String toString() {
        try {
            return new JSONObject().put("code", code).put("desc", desc).toString();
        } catch (JSONException e) {
            return super.toString();
        }
    }
}
