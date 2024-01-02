package com.enicom.board.kyoritsu.dao.repository.access;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;

public interface AccessLogRepositoryCustom {
    
    // list 창에서 선택된 accessLog를 삭제
    Long deleteListAccessLog(MultipleParam param);
    // 전체 accessLog를 삭제
    Long deleteAllAccessLog();
    // 기간 range accessLog를 삭제
    Long deleteRangeAccessLog(MultipleParam param);
}
