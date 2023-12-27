package com.enicom.board.kyoritsu.dao.repository.notice;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;

public interface NoticeRepositoryCustom {
    // list 창에서 선택된 notice entity를 삭제
    Long deleteListContent(MultipleParam param);
    // 전체 notice entity를 삭제
    Long deleteAllContent();
}
