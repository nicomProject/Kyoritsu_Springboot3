package com.enicom.board.kyoritsu.utils;

/**
 *  Param에 대한 utility 함수 정의
**/

public class ParamUtil {
    // obj를 int로 변환. 사용불가 및 실패 시 -1 반환
    public static int parseInt(Object obj) {
        if(obj == null) return -1;
        try {
            return Integer.parseInt(obj.toString());
        } catch (Exception e) {
            return -1;
        }
    }
}