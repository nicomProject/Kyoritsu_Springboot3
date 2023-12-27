package com.enicom.board.kyoritsu.dao.repository.notice;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.QNotice;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NoticeRepositoryCustomImpl implements NoticeRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public Long deleteListContent(MultipleParam param) {
        QNotice qNotice = QNotice.notice;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qNotice)
                .set(qNotice.deleteDate, LocalDateTime.now())
                .set(qNotice.deleteUser, member.getId())
                .where(qNotice.recKey.in(param.getIdListLong())).execute();
    }

    @Transactional
    @Override
    public Long deleteAllContent() {
        QNotice qNotice = QNotice.notice;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qNotice)
                .set(qNotice.deleteDate, LocalDateTime.now())
                .set(qNotice.deleteUser, member.getId())
                .execute();
    }
    
}
