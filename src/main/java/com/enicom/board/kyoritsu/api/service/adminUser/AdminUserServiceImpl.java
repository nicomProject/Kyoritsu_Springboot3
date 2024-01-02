package com.enicom.board.kyoritsu.api.service.adminUser;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.param.AdminUserInfoParam;
import com.enicom.board.kyoritsu.api.param.AdminUserPasswordParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleType;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.AdminUser;
import com.enicom.board.kyoritsu.dao.repository.AdminUserRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    // field 정의
    private final SecurityUtil securityUtil;
    private final AdminUserRepository adminUserRepository;

    @Override
    public PageVO<AdminUser> findAll() {
        return PageVO.builder(adminUserRepository.findAllByDeleteDateNullOrderByRecKey()).build();
    }

    @Override
    public PageVO<AdminUser> findAll(AdminUserInfoParam param) {
        return PageVO.builder(adminUserRepository.findAllByRecKey(Long.valueOf(param.getKey()))).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> add(AdminUserInfoParam param) {
        // id는 unique함
        Optional<AdminUser> adminUserOptional = adminUserRepository.findByUserId(param.getId());
        MemberDetail member = securityUtil.getCurrentUser();
        // 해당 id를 가진 사람이 존재한다면, 추가 못하게 막기
        if (adminUserOptional.isPresent()) {
            return ResponseDataValue.builder(409).build();
        } 
        // 해당 id를 가진 사람이 없다면 진행
        else {
            AdminUser adminUser = AdminUser.builder()
                        .userId(param.getId())
                        .name(param.getName())
                        .role(param.getRole())
                        .enable(param.getEnable())
                        .createDate(LocalDateTime.now())
                        .createUser(member.getId())
                        .password(securityUtil.getEncodedInitPwd()).build();
            
            adminUserRepository.save(adminUser);
        }
        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> modify(AdminUserInfoParam param) {
        Optional<AdminUser> adminUserOptional = adminUserRepository.findByRecKey(Long.valueOf(param.getKey()));
        if(!adminUserOptional.isPresent()) {
            // 조회 결과가 없습니다.
            return ResponseDataValue.builder(210).build();
        }
        else {
            AdminUser adminUser = adminUserOptional.get();
            adminUser.setName(param.getName());
            adminUser.setRole(param.getRole());
            adminUser.setEnable(param.getEnable());
            adminUser.setEditDate(LocalDateTime.now());
            // enable을 활성화로 변경할 경우, failureCnt도 0으로 초기화
            if(param.getEnable() != 2) adminUser.setFailureCnt(0);

            adminUserRepository.save(adminUser);
        }
        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> delete(MultipleParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        // 로그인 세션 정보가 없습니다.
        if(member == null) return ResponseDataValue.builder(421).build();
        // 현재 자신을 삭제할 수 없습니다.
        if(member.getId().equals(param.getId())) return ResponseDataValue.builder(400).desc("자기 자신을 삭제할 수 없습니다.").build();
        
        MultipleType type = param.getType();
        // 값이 하나라면 바로 삭제 진행
        if(type.equals(MultipleType.ONE)) {
            adminUserRepository.deleteById(Long.valueOf(param.getKey()));
        }
        // TODO : 값이 여러개라면?
        return ResponseDataValue.builder(200).build();
    }

    @Override
    public ResponseDataValue<?> init(MultipleParam param) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'init'");
    }

    @Transactional
    @Override
    public ResponseDataValue<?> changePassword(AdminUserPasswordParam param) {
        MemberDetail current = securityUtil.getCurrentUser();
        if (current == null) {
            return ResponseDataValue.builder(421).build();
        }

        AdminUser manager = adminUserRepository.findByRecKey(Long.valueOf(param.getKey())).get();

        String password = param.getPassword();
        String newPassword = param.getNewPassword();
        String newPasswordConfirm = param.getNewPasswordConfirm();

        if (!securityUtil.match(param.getPassword(), manager.getPassword())) {
            return ResponseDataValue.builder(400).desc("기존 비밀번호가 일치하지 않습니다.").build();
        } else if (password.equals(newPassword)) {
            return ResponseDataValue.builder(400).desc("기존과 동일한 비밀번호 입니다.").build();
        } else if (!newPassword.equals(newPasswordConfirm)) {
            return ResponseDataValue.builder(400).desc("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.").build();
        }

        manager.setPassword(securityUtil.encode(newPassword));
        manager.setEditDate(LocalDateTime.now());
        adminUserRepository.save(manager);

        return ResponseDataValue.builder(200).desc("비밀번호가 성공적으로 수정되었습니다!").build();
    }
    
}
