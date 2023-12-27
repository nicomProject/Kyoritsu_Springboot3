package com.enicom.board.kyoritsu.api.service.notice;

import com.enicom.board.kyoritsu.api.param.NoticeParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.InfoVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.Notice;

public interface NoticeService {
    PageVO<Notice> findAll();
    PageVO<Notice> findAll(NoticeParam param);
    InfoVO<Notice> findBy(Long recKey);
    ResponseDataValue<?> add(NoticeParam param);
    ResponseDataValue<?> delete(MultipleParam param);
    ResponseDataValue<?> update(NoticeParam param);
}
