package com.enicom.board.kyoritsu.dao.repository.access;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Repository;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.dao.entity.QAccessLog;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AccessLogRepositoryCustomImpl implements AccessLogRepositoryCustom {
    // field 정의
    private final JPAQueryFactory factory;

    @Transactional
    @Override
    public Long deleteListAccessLog(MultipleParam param) {
        QAccessLog qAccessLog = QAccessLog.accessLog;
        return factory.delete(qAccessLog)
                    .where(qAccessLog.recKey.in(param.getIdListLong())).execute();
    }

    @Transactional
    @Override
    public Long deleteAllAccessLog() {
        QAccessLog qAccessLog = QAccessLog.accessLog;
        return factory.delete(qAccessLog).execute();
    }
    
    @Transactional
    @Override
    public Long deleteRangeAccessLog(MultipleParam param) {
        QAccessLog qAccessLog = QAccessLog.accessLog;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime stDate = LocalDate.parse(param.getStartDate(), formatter).atStartOfDay();
        LocalDateTime enDate = LocalDate.parse(param.getEndDate(), formatter).atStartOfDay();

            
        return factory.delete(qAccessLog)
                    .where(qAccessLog.loginDate.gt(stDate))
                    .where(qAccessLog.loginDate.lt(enDate))
                    .execute();
    }
}