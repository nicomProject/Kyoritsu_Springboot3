package com.enicom.board.kyoritsu.api.service.applicant;

import org.springframework.web.multipart.MultipartFile;

import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;

public interface ApplicantService {
    PageVO<Applicant> findAll(Long key);
    PageVO<Applicant> findApplicantWithJob(Long key);
    ResponseDataValue<?> add(ApplicantParam param);
    ResponseDataValue<?> apply(ApplicantParam param);
    ResponseDataValue<?> applyFiles(Long recKey, String applicantName, MultipartFile profile, MultipartFile[] files);
}
