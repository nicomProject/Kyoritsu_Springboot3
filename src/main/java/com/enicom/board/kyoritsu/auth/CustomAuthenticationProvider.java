package com.enicom.board.kyoritsu.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        String password = authentication.getCredentials().toString();

        log.info("접속 아이디: {}", username);

        // 사용자가 존재하지 않음 (기본값 null 잡아줘야함!!)
        MemberDetail member = null;
        try {
            member = memberDetailService.loadUserByUsername(username);
        } catch(UsernameNotFoundException e) {
            member = null;
        }
        if(member == null) {
            System.out.println("일치하는 사용자 아이디가 없습니다.");
            throw new BadCredentialsException("일치하는 사용자 아이디가 없습니다.");
        }

        System.out.println(member.getPassword());
        System.out.println(password);
        System.out.println(passwordEncoder.matches(password, member.getPassword()));

        // 사용자의 상태에 따라 인증 실패 처리 (비활성화 계정, 계정 잠김, 비밀번호 불일치)
        if(!member.isEnabled()) { // 비밀번호 불일치 5회 초과 시 계정 잠김
            System.out.println("사용이 중지된 계정입니다.\r\n관리자에게 문의하시기 바랍니다.");
            throw new DisabledException("사용이 중지된 계정입니다.\r\n관리자에게 문의하시기 바랍니다.");
        } else if (!member.isAccountNonLocked()) {
            System.out.println("로그인 시도 가능 횟수를 초과했습니다.\r\n관리자에게 문의하시기 바랍니다.");
            throw new LockedException("로그인 시도 가능 횟수를 초과했습니다.\r\n관리자에게 문의하시기 바랍니다.");
        } else if (!this.passwordEncoder.matches(password, member.getPassword())) {
            System.out.println("비밀번호가 일치하지 않습니다. 로그인 실패 5회 초과 시 계정이 비활성화됩니다. (현재 "+(member.getFailureCnt()+1)+" 회)");
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다. 로그인 실패 5회 초과 시 계정이 비활성화됩니다. (현재 "+(member.getFailureCnt()+1)+" 회)");
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
