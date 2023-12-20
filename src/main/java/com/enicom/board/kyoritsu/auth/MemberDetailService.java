package com.enicom.board.kyoritsu.auth;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.dao.entity.AdminUser;
import com.enicom.board.kyoritsu.dao.entity.Code;
import com.enicom.board.kyoritsu.dao.repository.AdminUserRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

/**
 *  Spring security의 UserDetailsService를 구현한 MemberDetailService 정의.
 *  LoginHandler 및 CustomAuthenticationProvider에서 사용.
**/

@Service
public class MemberDetailService implements UserDetailsService {
    // field 정의
    private final AdminUserRepository adminUserRepository;
    private final SecurityUtil securityUtil;

    @Autowired
    public MemberDetailService(AdminUserRepository adminUserRepository, SecurityUtil securityUtil) {
        this.adminUserRepository = adminUserRepository;
        this.securityUtil = securityUtil;
    }

    // 사용자 UserDetails 반환. 일치하는 사용자가 없다면 Error 발생시키기
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AdminUser> adminUserOptional = adminUserRepository.findByUserId(username);
        if(!adminUserOptional.isPresent()) {
            throw new UsernameNotFoundException("이용자를 찾을 수 없습니다.");
        }
        return adminUserOptional.get().toMember();
    }

    // 로그인 실패 시, failureCnt + 1
    public void updateFailureCount(String username) {
        adminUserRepository.findByUserId(username).ifPresent(adminUser -> {
            adminUser.setFailureCnt(adminUser.getFailureCnt()+1);
            adminUserRepository.save(adminUser);
        });
    }

    // 접속 시간 업데이트 & failureCnt = 0
    public void updateAccessDate(String username) {
        adminUserRepository.findByUserId(username).ifPresent(adminUser -> {
            adminUser.setFailureCnt(0);
            adminUser.setLoginDate(LocalDateTime.now());
            adminUserRepository.save(adminUser);
        });
    }

    // 초기 비밀번호 반환
    public String getInitPwd() {
        Code code = securityUtil.getInitPwd();
        return code.getValue1();
    }
    
}
