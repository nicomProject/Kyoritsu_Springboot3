package com.enicom.board.kyoritsu.api.service.notice;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.Notice;

public interface NoticeService {
    // Notice entity를 모두 반환
    PageVO<Notice> findAll();
}
