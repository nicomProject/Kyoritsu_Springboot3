package com.enicom.board.kyoritsu.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.dao.entity.AccessLog;
import com.enicom.board.kyoritsu.dao.repository.AccessLogRepository;
import com.enicom.board.kyoritsu.utils.Utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 *  Spring security의 AuthenticationFailureHandler를 구현한 LoginFailureHandler 정의.
**/

@Component
@Slf4j
public class LoginFailureHandler implements AuthenticationFailureHandler {
    // field 정의
    @Autowired
    private MemberDetailService memberDetailService;
    @Autowired
    private AccessLogRepository accessLogRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        String userName = request.getParameter("userName");

        // 접속 로그 추가
        AccessLog accessLog = AccessLog.builder().loginId(userName).loginResult(0).loginIp(Utils.getClientIP(request)).build();
        accessLogRepository.save(accessLog);

        // 실패 횟수 업데이트
        memberDetailService.updateFailureCount(userName);

        // 로그 출력
        log.info("[Login Failed] - user: {}, message: {}", userName, exception.getMessage());

        // response 작성
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(ResponseDataValue.builder(480).build().toString());
    }

}
