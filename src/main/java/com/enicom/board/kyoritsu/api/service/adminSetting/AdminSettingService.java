package com.enicom.board.kyoritsu.api.service.adminSetting;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.api.vo.RoleVO;
import com.enicom.board.kyoritsu.dao.entity.AdminMenu;

public interface AdminSettingService {
    // 모든 관리자 메뉴를 order_seq 오름차순으로 전부 반환
    PageVO<AdminMenu> getAdminMenuList();
    // 최하위 RoleType부터 현재 관리자의 RoleType까지 모두 저장하여 반환
    PageVO<RoleVO> getRoleList();
}
