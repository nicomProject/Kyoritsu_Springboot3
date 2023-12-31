package com.enicom.board.kyoritsu.dao.repository.job;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.QJob;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class JobRepositoryCustomImpl implements JobRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public Long deleteListJob(MultipleParam param) {
        QJob qJob = QJob.job;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qJob)
                .set(qJob.deleteDate, LocalDateTime.now())
                .set(qJob.deleteUser, member.getId())
                .where(qJob.recKey.in(param.getIdListLong())).execute();
    }

    @Transactional
    @Override
    public Long deleteAllJob() {
        QJob qJob = QJob.job;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qJob)
                .set(qJob.deleteDate, LocalDateTime.now())
                .set(qJob.deleteUser, member.getId())
                .execute();
    }
    
}