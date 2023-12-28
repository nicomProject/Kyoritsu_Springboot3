package com.enicom.board.kyoritsu.api.service.inquiry;

import com.enicom.board.kyoritsu.api.param.InquiryParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.Inquiry;

public interface InquiryService {
    // Inquiry entity를 모두 반환
    PageVO<Inquiry> findAll();
    // key에 해당하는 Inquiry entity를 반환
    PageVO<Inquiry> findAll(Long key);
    // param에 해당하는 Inquiry entity를 반환
    PageVO<Inquiry> findAll(InquiryParam param);
    // Inquiry entity를 추가하고 결과를 반환
    ResponseDataValue<?> add(InquiryParam param);
    // Inquiry entity에 answer 추가하고 결과를 반환
    ResponseDataValue<?> addAnswer(InquiryParam param);
    // Inquiry entity를 key를 통해 찾고 반환
    PageVO<Inquiry> findAllSelfPwd(Long key);
    ResponseDataValue<?> update(InquiryParam param);
    ResponseDataValue<?> delete(MultipleParam param);
}
