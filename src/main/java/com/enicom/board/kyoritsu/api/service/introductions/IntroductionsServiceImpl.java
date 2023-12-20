package com.enicom.board.kyoritsu.api.service.introductions;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.repository.IntroductionsRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IntroductionsServiceImpl implements IntroductionsService {
    private final IntroductionsRepository introductionsRepository;

    @Transactional
    @Override
    public PageVO<?> findAll() {
        return PageVO.builder(introductionsRepository.findAllByDeleteDateNull()).build();
    }
    
}
