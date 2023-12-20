package com.enicom.board.kyoritsu.api.service.adminSetting;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.api.vo.RoleVO;
import com.enicom.board.kyoritsu.dao.entity.AdminMenu;
import com.enicom.board.kyoritsu.dao.repository.AdminMenuRepository;
import com.enicom.board.kyoritsu.dao.type.RoleType;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminSettingServiceImpl implements AdminSettingService {
    private final SecurityUtil securityUtil;
    private final AdminMenuRepository adminMenuRepository;

    // 모든 관리자 메뉴를 order_seq 오름차순으로 전부 반환
    @Override
    public PageVO<AdminMenu> getAdminMenuList() {
        return PageVO.builder(adminMenuRepository.findAllByOrderByOrderSeqAsc()).build();
    }

    // 최하위 RoleType부터 현재 관리자의 RoleType까지 모두 저장하여 반환
    @Override
    public PageVO<RoleVO> getRoleList() {
        List<RoleType> roles = securityUtil.getRoleList();
        return PageVO.builder(Arrays.stream(RoleType.values())
            .filter(roles::contains)
            .map(role -> RoleVO.builder()
                .key(role.name())
                .rank(role.getRank())
                .value(role.getAlias())
                .build()
            ).collect(Collectors.toList())).build();
    }
    
}
