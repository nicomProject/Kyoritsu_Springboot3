package com.enicom.board.kyoritsu.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.service.mainSetting.MainSettingService;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.dao.entity.MainMenu;

import ch.qos.logback.core.model.Model;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

/**
 *  HomePage의 mainMenu 세팅에 대한 resources를 요청받고 처리함.
**/

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/main/setting")
public class MainSettingController {
    // field 정의
    private final MainSettingService mainSettingService;

    // [url] : /api/main/setting/menus
    // 메인 메뉴 목록을 모두 반환
    @RequestMapping(path = "/menus", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 60, desc = "메인 메뉴 목록 조회")
    public ResponseHandler<?> getMainMenuList(Model model, @RequestParam("languageValue") String languageValue, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(!languageValue.equals("origin")) {
            session.setAttribute("languageValue", languageValue);
        }
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        List<MainMenu> mainMenuList = mainSettingService.getMainMenuList(language);
        return new ResponseHandler<>(PageVO.builder(mainMenuList).build());
    }

    // [url] : /api/main/setting/category
    // 메인 메뉴 목록 중, MainMenuType.INTRO 목록을 반환
    @RequestMapping(path = "/category", method = {RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 60, desc = "메인 메뉴 중, MainMenuType.INTRO 목록 조회")
    public ResponseHandler<?> getMainMenuList_INTRO() {
        return new ResponseHandler<>(mainSettingService.getMainMenuList_INTRO());
    }
}
