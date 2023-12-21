package com.enicom.board.kyoritsu.api.service.adminUser;

import com.enicom.board.kyoritsu.api.param.AdminUserInfoParam;
import com.enicom.board.kyoritsu.api.param.AdminUserPasswordParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.AdminUser;

public interface AdminUserService {
    PageVO<AdminUser> findAll();

    PageVO<AdminUser> findAll(AdminUserInfoParam param);

    ResponseDataValue<?> add(AdminUserInfoParam param);

    ResponseDataValue<?> modify(AdminUserInfoParam param);

    ResponseDataValue<?> delete(MultipleParam param);

    ResponseDataValue<?> init(MultipleParam param);

    ResponseDataValue<?> changePassword(AdminUserPasswordParam param);
}
