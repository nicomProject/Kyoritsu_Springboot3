package com.enicom.board.kyoritsu.api.service.notice;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.Notice;
import com.enicom.board.kyoritsu.dao.repository.NoticeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {
    private final NoticeRepository noticeRepository;

    @Transactional
    @Override
    public PageVO<Notice> findAll() {
        return PageVO.builder(noticeRepository.findAllByDeleteDateNullOrderByCreateDateDesc()).build();
    }
    
}
