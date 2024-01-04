package com.enicom.board.kyoritsu.api.service.adminSetting;

import com.enicom.board.kyoritsu.api.param.CodeParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.InfoVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.api.vo.RoleVO;
import com.enicom.board.kyoritsu.dao.entity.AdminMenu;
import com.enicom.board.kyoritsu.dao.entity.Code;

public interface AdminSettingService {
    // 모든 관리자 메뉴를 order_seq 오름차순으로 전부 반환
    PageVO<AdminMenu> getAdminMenuList();
    // 최하위 RoleType부터 현재 관리자의 RoleType까지 모두 저장하여 반환
    PageVO<RoleVO> getRoleList();
    // 최하위 RoleType부터 최상위 RoleType까지 모두 저장하여 반환
    PageVO<RoleVO> getAllRoleList();
    // 현재 초기 비밀번호를 반환
    InfoVO<Code> getInitPwd();
    // 초기 비밀번호를 변경하고 변경 성공여부를 반환
    ResponseDataValue<?> setInitPwd(CodeParam param);
}
