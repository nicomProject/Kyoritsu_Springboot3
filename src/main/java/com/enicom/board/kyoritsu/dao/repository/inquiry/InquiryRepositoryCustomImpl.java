package com.enicom.board.kyoritsu.dao.repository.inquiry;

import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Repository;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.QInquiry;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InquiryRepositoryCustomImpl implements InquiryRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public Long deleteListContent(MultipleParam param) {
        QInquiry qInquiry = QInquiry.inquiry;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qInquiry)
                .set(qInquiry.deleteDate, LocalDateTime.now())
                .set(qInquiry.deleteUser, member.getId())
                .where(qInquiry.recKey.in(param.getIdListLong()))
                .execute();
    }

    @Transactional
    @Override
    public Long deleteAllContent() {
        QInquiry qInquiry = QInquiry.inquiry;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qInquiry)
                .set(qInquiry.deleteDate, LocalDateTime.now())
                .set(qInquiry.deleteUser, member.getId())
                .execute();
    }
    
}