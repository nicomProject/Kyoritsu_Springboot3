package com.enicom.board.kyoritsu.dao.repository.applicant;

import com.enicom.board.kyoritsu.dao.entity.Applicant;

import java.util.List;

public interface ApplicantRepositoryCustom {
    List<Applicant> findByJobId(Long jobId);
}