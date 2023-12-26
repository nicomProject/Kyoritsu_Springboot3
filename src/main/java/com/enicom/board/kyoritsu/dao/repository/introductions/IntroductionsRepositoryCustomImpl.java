package com.enicom.board.kyoritsu.dao.repository.introductions;

import java.time.LocalDateTime;

import org.springframework.stereotype.Repository;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.QContent;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class IntroductionsRepositoryCustomImpl implements IntroductionsRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public Long deleteListContent(MultipleParam param) {
        QContent qContent = QContent.content1;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qContent)
                .set(qContent.deleteDate, LocalDateTime.now())
                .set(qContent.deleteUser, member.getId())
                .where(qContent.recKey.in(param.getIdListLong())).execute();
    }

    @Transactional
    @Override
    public Long deleteAllContent() {
        QContent qContent = QContent.content1;
        MemberDetail member = securityUtil.getCurrentUser();

        return factory.update(qContent)
                .set(qContent.deleteDate, LocalDateTime.now())
                .set(qContent.deleteUser, member.getId())
                .execute();
    }
    
}
