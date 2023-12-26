package com.enicom.board.kyoritsu.api.service.mainSetting;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.MainMenu;
import com.enicom.board.kyoritsu.dao.repository.MainMenuRepository;
import com.enicom.board.kyoritsu.dao.type.MainMenuType;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 *  HomePage의 mainMenu 세팅에 대한 resources를 요청받고 처리함.
**/

@Service
@RequiredArgsConstructor
public class MainSettingServiceImpl implements MainSettingService {
    private final MainMenuRepository mainMenuRepository;

    @Transactional // 하나의 트랜잭션으로 관리
    @Override
    public PageVO<MainMenu> getMainMenuList() {
        return PageVO.builder(mainMenuRepository.findAllByOrderByRecKey()).build();
    }

    @Transactional // 하나의 트랜잭션으로 관리
    @Override
    public PageVO<MainMenu> getMainMenuList_INTRO() {
        return PageVO.builder(mainMenuRepository.findAllByTypeOrderByRecKey(MainMenuType.INTRO)).build();
    }
}
