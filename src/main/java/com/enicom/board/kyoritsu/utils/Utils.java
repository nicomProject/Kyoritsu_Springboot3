package com.enicom.board.kyoritsu.utils;

import jakarta.servlet.http.HttpServletRequest;

public class Utils {
    // request에 담긴 Header 정보로 ClientIP를 반환
    public static String getClientIP(HttpServletRequest request) {
    String[] headers = {"Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR",
            "X-Real-IP", "X-RealIP", "REMOTE_ADDR"};
    String ip = request.getHeader("X-Forwarded-For");

    for (String header : headers) {
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader(header);
        }
    }

    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
        ip = request.getRemoteAddr();
    }

    if(ip.equals("0:0:0:0:0:0:0:1")){
        ip = "127.0.0.1";
    }

    return ip;
}
}
