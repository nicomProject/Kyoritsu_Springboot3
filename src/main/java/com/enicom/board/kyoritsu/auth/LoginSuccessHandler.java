package com.enicom.board.kyoritsu.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.dao.entity.AccessLog;
import com.enicom.board.kyoritsu.dao.repository.access.AccessLogRepository;
import com.enicom.board.kyoritsu.utils.Utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 *  Spring security의 AuthenticationSuccessHandler를 구현한 LoginSuccessHandler 정의.
**/

@Component
@Slf4j
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    // field 정의
    @Autowired
    private MemberDetailService memberDetailService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private AccessLogRepository accessLogRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        MemberDetail member = (MemberDetail) authentication.getPrincipal();

        // 접속 로그 추가
        AccessLog accessLog = AccessLog.builder().loginId(member.getId()).loginIp(Utils.getClientIP(request)).build();
        accessLogRepository.save(accessLog);

        // 초기 비밀번호로 로그인했는지 체크
        String initPwd = memberDetailService.getInitPwd();
        int successCode = 220;
        if(passwordEncoder.matches(initPwd, member.getPassword())) {
            successCode = 221;
        }

        // access date 업데이트
        memberDetailService.updateAccessDate(member.getUsername());

        // 로그 출력
        log.info("[Login Success] - user: {}", member.getUsername());

        // response 작성
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(ResponseDataValue.builder(successCode).build().toString());
    }
}
