package com.enicom.board.kyoritsu.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 *  Spring security의 'AuthenticationProvider'를 구현하여 사용자의 인증을 담당함.
**/

@Component
@Slf4j
public class CustomAuthenticationProvider implements AuthenticationProvider {
    // field 정의
    @Autowired
    private MemberDetailService memberDetailService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 사용자가 제공한 인증 정보를 기반으로 실제 사용자 정보와 비교하여 사용자 인증을 진행.
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = passwordEncoder.encode(authentication.getCredentials().toString());

        log.info("접속 아이디: {}", username);

        // 사용자가 존재하지 않음
        UserDetails member = memberDetailService.loadUserByUsername(username);
        if(member == null) {
            throw new BadCredentialsException("일치하는 사용자 아이디가 없습니다.");
        }

        // 사용자의 상태에 따라 인증 실패 처리 (비활성화 계정, 계정 잠김, 비밀번호 불일치)
        if(!member.isEnabled()) {
            throw new DisabledException("사용이 중지된 계정입니다.\r\n관리자에게 문의하시기 바랍니다.");
        } else if (!member.isAccountNonLocked()) {
            throw new LockedException("로그인 시도 가능 횟수를 초과했습니다.\r\n관리자에게 문의하시기 바랍니다.");
        } else if (!this.passwordEncoder.matches(member.getPassword(), password)) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // 인증 성공 시, token 반환
        return new UsernamePasswordAuthenticationToken(member, password, member.getAuthorities());
    }

    // 이 provider가 지원하는 인증 토큰 타입 명시
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
