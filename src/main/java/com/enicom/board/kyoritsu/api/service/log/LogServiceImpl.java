package com.enicom.board.kyoritsu.api.service.log;

import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleType;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.AccessLog;
import com.enicom.board.kyoritsu.dao.repository.access.AccessLogRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LogServiceImpl implements LogService {
    private final AccessLogRepository accessLogRepository;

    @Override
    public PageVO<AccessLog> getAccessLogList() {
        return PageVO.builder(accessLogRepository.findAllByOrderByLoginDateDesc()).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> deleteAccessLogList(MultipleParam param) {
        MultipleType type = param.getType();

        if (type.equals(MultipleType.LIST)) {
            accessLogRepository.deleteListAccessLog(param);
        }
        else if(type.equals(MultipleType.SPECIFIC)){
            accessLogRepository.deleteAllAccessLog();
        }
        else if(type.equals(MultipleType.RANGE)) {
            System.out.println("TTTTTTEEEEEEEEEESSSSSSSSSSTTTTTTTTTTTTTT");
            accessLogRepository.deleteRangeAccessLog(param);
        }

        return ResponseDataValue.builder(200).build();
    }
}

