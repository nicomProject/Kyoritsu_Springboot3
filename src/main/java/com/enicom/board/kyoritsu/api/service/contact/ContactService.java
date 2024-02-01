package com.enicom.board.kyoritsu.api.service.contact;

import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.param.ContactParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.Applicant;
import org.springframework.web.multipart.MultipartFile;

public interface ContactService {
    ResponseDataValue<?> add(ContactParam param);
}
