package com.enicom.board.kyoritsu.api.service.log;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.AccessLog;
import com.enicom.board.kyoritsu.dao.repository.AccessLogRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LogServiceImpl implements LogService {
    private final AccessLogRepository accessLogRepository;

    @Override
    public PageVO<AccessLog> getAccessLogList() {
        return PageVO.builder(accessLogRepository.findAll()).build();
    }
}

