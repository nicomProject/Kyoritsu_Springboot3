package com.enicom.board.kyoritsu.api.service.mainSetting;

import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.MainMenu;

/**
 *  HomePage의 mainMenu 세팅에 대한 resources를 요청받고 처리함.
**/

public interface MainSettingService {
    // MainMenu를 모두 반환
    PageVO<MainMenu> getMainMenuList(); 
    // MainMenu중, MainMenuType.INTRO인 MainMenu만 모두 반환
    PageVO<MainMenu> getMainMenuList_INTRO();
}
