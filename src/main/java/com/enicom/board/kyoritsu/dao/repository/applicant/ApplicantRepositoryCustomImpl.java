package com.enicom.board.kyoritsu.dao.repository.applicant;

import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.enicom.board.kyoritsu.dao.entity.QApplicant;
import com.enicom.board.kyoritsu.dao.entity.QJob;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class ApplicantRepositoryCustomImpl implements ApplicantRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;

    @Transactional
    @Override
    public List<Applicant> findByJobId(Long jobId) {
        QApplicant qApplicant = QApplicant.applicant;
        QJob qJob = QJob.job;


        return factory.selectFrom(qApplicant)
                .where(qApplicant.jobId.eq(factory.selectFrom(qJob).where(qJob.recKey.eq(jobId))))
                .orderBy(qApplicant.recKey.asc())
                .fetch();
    }
}