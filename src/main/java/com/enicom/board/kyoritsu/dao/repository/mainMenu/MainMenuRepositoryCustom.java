package com.enicom.board.kyoritsu.dao.repository.mainMenu;

import java.util.List;

import com.enicom.board.kyoritsu.dao.entity.MainMenu;

public interface MainMenuRepositoryCustom {
    // 한국어 버전
    List<MainMenu> findAllName();
    // 영어 버전
    List<MainMenu> findAllNameEnglish();
    // 일본어 버전
    List<MainMenu> findAllnameJapanese();
}
