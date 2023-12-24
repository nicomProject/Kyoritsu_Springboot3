package com.enicom.board.kyoritsu.api.service.introductions;

import com.enicom.board.kyoritsu.api.param.IntroductionsParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;

public interface IntroductionsService {
    PageVO<?> findAll();
    ResponseDataValue<?> add(IntroductionsParam param);
    ResponseDataValue<?> update(IntroductionsParam param);
    ResponseDataValue<?> delete(MultipleParam param);
    ResponseDataValue<?> check(MultipleParam param);
}
