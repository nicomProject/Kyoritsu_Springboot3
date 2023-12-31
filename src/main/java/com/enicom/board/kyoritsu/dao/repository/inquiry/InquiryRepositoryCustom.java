package com.enicom.board.kyoritsu.dao.repository.inquiry;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;

public interface InquiryRepositoryCustom {
    // list 창에서 선택된 introductions entity를 삭제
    Long deleteListContent(MultipleParam param);
    // 전체 introductions entity를 삭제
    Long deleteAllContent();
}
