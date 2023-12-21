package com.enicom.board.kyoritsu.utils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.AdminMenu;
import com.enicom.board.kyoritsu.dao.entity.Code;
import com.enicom.board.kyoritsu.dao.repository.AdminMenuRepository;
import com.enicom.board.kyoritsu.dao.repository.CodeRepository;
import com.enicom.board.kyoritsu.dao.type.AdminMenuType;
import com.enicom.board.kyoritsu.dao.type.CodeGroupType;
import com.enicom.board.kyoritsu.dao.type.RoleType;

/**
 *  Authentication 관련 utility 함수 정의.
**/

@Component
public class SecurityUtil {
    // field 정의
    private final SessionRegistry sessionRegistry;
    private final BCryptPasswordEncoder encoder;
    private final CodeRepository codeRepository;
    private final AdminMenuRepository adminMenuRepository;

    @Value("${system.initPwd}")
    private String initPwd;

    @Autowired
    public SecurityUtil(SessionRegistry sessionRegistry, BCryptPasswordEncoder encoder, CodeRepository codeRepository, AdminMenuRepository adminMenuRepository) {
        this.sessionRegistry = sessionRegistry;
        this.encoder = encoder;
        this.codeRepository = codeRepository;
        this.adminMenuRepository = adminMenuRepository;
    }

    // 초기 비밀번호 가져오기
    public Code getInitPwd() {
        return codeRepository.findByGroupAndCode(CodeGroupType.SYSTEM, "initPwd")
                .orElse(Code.builder().group(CodeGroupType.SYSTEM).code("initPwd").value1(initPwd).build());
    }

    // 암호화된 초기 비밀번호 가져오기
    public String getEncodedInitPwd() {
        String raw = getInitPwd().getValue1();
        return encoder.encode(raw);
    }

    // 인자를 암호화하여 반환
    public String encode(String raw) {
        return encoder.encode(raw);
    }

    // 인자로 받은 두 값이 일치하는지 확인
    public boolean match(String raw, String encoded) {
        return encoder.matches(raw, encoded);
    }

    // 인자로 받은 값이 암호화 되어있는지 확인
    public boolean isEncoded(String encoded) {
        try {
            // encoded 가 암호화 되어있다면 정상 동작함
            encoder.upgradeEncoding(encoded);
        } catch (IllegalArgumentException e) {
            return false;
        }
        return true;
    }

    // 현재 유저가 있다면 반환, 없다면 null 반환
    public MemberDetail getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MemberDetail member;
        try {
            member = (MemberDetail) auth.getPrincipal();
        } catch (Exception e) {
            return null;
        }

        if(!(auth instanceof AnonymousAuthenticationToken) && !sessionRegistry.getAllSessions(auth.getPrincipal(), false).isEmpty()) {
            return member;
        }

        return null;
    }

    // 현재 유저의 role list를 반환. 현재 유저가 없다면 빈 list 반환
    public List<RoleType> getRoleList() {
        // 빈 list 정의
        List<RoleType> roles = Collections.emptyList();
        // 현재 관리자 정보를 받아옴
        MemberDetail member = getCurrentUser();
        // 관리자가 존재할 경우, (정상 로그인 상태)
        if(member != null) {
            // 최하위 RoleType부터 현재 관리자의 RoleType까지 모두 list에 저장
            roles = member.getRoles();
        }
        // 반환
        return roles;
    }

    public Optional<AdminMenu> getMenu(String code) {
        code = code.toUpperCase();
        return adminMenuRepository.findByCode(AdminMenuType.valueOf(code));
    }

    public Optional<AdminMenu> getDetailMenu(String code) {
        code = code.toUpperCase();
        return adminMenuRepository.findByCodeDetail(code);
    }

}
