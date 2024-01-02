package com.enicom.board.kyoritsu.api.service.log;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.AccessLog;

public interface LogService {
    PageVO<AccessLog> getAccessLogList();
    ResponseDataValue<?> deleteAccessLogList(MultipleParam param);
}

