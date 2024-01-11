package com.enicom.board.kyoritsu.runner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.enicom.board.kyoritsu.dao.entity.Category;
import com.enicom.board.kyoritsu.dao.entity.MainMenu;
import com.enicom.board.kyoritsu.dao.repository.category.CategoryRepository;
import com.enicom.board.kyoritsu.dao.repository.mainMenu.MainMenuRepository;
import com.enicom.board.kyoritsu.dao.type.MainMenuType;

import lombok.extern.slf4j.Slf4j;

/**
 *  DB에 기본적으로 저장되어야 할 Main(not admin) 데이터를 저장. 
 *  기존 DB 저장값은 건들지 않도록 하되, 기본 사항 누락에 대해서는 추가되도록 함.
 *  회사소개/사업소개 내 하위 메뉴를 관리자가 직접 추가/삭제할 수 있도록 해야 한다는데.. 
 *  기본적인 내용도 삭제가 가능하도록 할 것인지 확인이 필요함. (일단은 기본적인건 고정되도록 코드를 작성함)
**/

@Component
@Slf4j
public class MainDataInitRunner implements ApplicationRunner {
    // field 정의
    private final MainMenuRepository mainMenuRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public MainDataInitRunner(MainMenuRepository mainMenuRepository, CategoryRepository categoryRepository) {
        this.mainMenuRepository = mainMenuRepository;
        this.categoryRepository = categoryRepository;
    }

    // 프로그램 실행 시, 최초 1회 실행
    @Override
    public void run(ApplicationArguments args) throws Exception {
        configureMainMenu();        // MainMenu entity 추가 (메인 메뉴 그룹 및 하위 메뉴 설정)
        configureSupportMenu();     // Category entity 추가 (지원분야 설정. 나중에 Support entity로 변경 예정)
    }

    // MainMenu entity 추가 (메인 메뉴 그룹 및 하위 메뉴 설정)
    private void configureMainMenu() {
        // DB에서 mainMenu 불러오기
        Map<String, MainMenu> mainMenuStoredList = new HashMap<>();
        mainMenuRepository.findAll().forEach(mainMenu -> {
            mainMenuStoredList.put(mainMenu.getName(), mainMenu);
        });

        // 기본 mainMenu (MainMenuType.GROUP) 정의
        MainMenu company = MainMenu.builder().order(1).name("회사소개").nameEnglish("About Us").nameJapanese("会社紹介").type(MainMenuType.GROUP).build();
        MainMenu product = MainMenu.builder().order(2).name("사업영역").nameEnglish("Business area").nameJapanese("事業領域").type(MainMenuType.GROUP).build();
        MainMenu notice = MainMenu.builder().order(3).name("공지사항").nameEnglish("Announcement").nameJapanese("お知らせ").type(MainMenuType.GROUP).build();
        MainMenu recruit = MainMenu.builder().order(4).name("채용정보").nameEnglish("Recruitment information").nameJapanese("採用情報").type(MainMenuType.GROUP).build();

        // 기존 mainMenu 그룹에 추가되어 있지 않은 mainMenu라면, mainMenuGroupList에 추가
        List<MainMenu> mainMenuGroupList = new ArrayList<>();
        if(!mainMenuStoredList.containsKey("회사소개")) {
            mainMenuGroupList.add(company);
        } 
        if(!mainMenuStoredList.containsKey("사업영역")) {
            mainMenuGroupList.add(product);
        } 
        if(!mainMenuStoredList.containsKey("공지사항")) {
            mainMenuGroupList.add(notice);
        } 
        if(!mainMenuStoredList.containsKey("채용정보")) {
            mainMenuGroupList.add(recruit);
        } 
        
        // mainMenu (MainMenuType.GROUP) 업데이트
        log.info("기존 메인 메뉴 {}건 확인", mainMenuStoredList.size());
        log.info("누락된 메인 메뉴 그룹 {}건 추가됨", mainMenuGroupList.size());
        mainMenuRepository.saveAll(mainMenuGroupList);

        // 하위 메뉴 
        List<MainMenu> mainMenuList = new ArrayList<>();
        
        // '회사소개' 하위 메뉴
        if(!mainMenuStoredList.containsKey("기업개요")) mainMenuList.add(MainMenu.builder().order(1).menu(company).url("/intro/overview").name("기업개요").nameEnglish("Company Overview").nameJapanese("企業概要").type(MainMenuType.INTRO).build());
        if(!mainMenuStoredList.containsKey("경영이념/비전")) mainMenuList.add(MainMenu.builder().order(2).menu(company).url("/intro/vision").name("경영이념/비전").nameEnglish("Management philosophy/Vision").nameJapanese("経営理念/ビジョン").type(MainMenuType.INTRO).build());
        if(!mainMenuStoredList.containsKey("연혁")) mainMenuList.add(MainMenu.builder().order(3).menu(company).url("/intro/history").name("연혁").nameEnglish("History").nameJapanese("歴史").type(MainMenuType.INTRO).build());
        if(!mainMenuStoredList.containsKey("조직도")) mainMenuList.add(MainMenu.builder().order(4).menu(company).url("/intro/organization").name("조직도").nameEnglish("Organization").nameJapanese("組織図").type(MainMenuType.INTRO).build());
        if(!mainMenuStoredList.containsKey("오시는길")) mainMenuList.add(MainMenu.builder().order(5).menu(company).url("/intro/location").name("오시는길").nameEnglish("Direction").nameJapanese("アクセス").type(MainMenuType.INTRO).build());
        
        // '사업영역' 하위 메뉴
        if(!mainMenuStoredList.containsKey("도미인")) mainMenuList.add(MainMenu.builder().order(2).menu(product).url("/business/dormyinn").name("도미인").nameEnglish("Dormy Inn").nameJapanese("ドーミー").type(MainMenuType.INTRO).build());

        // '채용정보' 하위 메뉴
        if(!mainMenuStoredList.containsKey("직원소개")) mainMenuList.add(MainMenu.builder().order(1).menu(recruit).url("/recruit/employee_info").name("직원소개").nameEnglish("Employee introduction").nameJapanese("社員紹介").type(MainMenuType.GENERAL).build());
        if(!mainMenuStoredList.containsKey("채용안내")) mainMenuList.add(MainMenu.builder().order(2).menu(recruit).url("/recruit/info").name("채용안내").nameEnglish("Recruitment information").nameJapanese("採用案内").type(MainMenuType.GENERAL).build());
        if(!mainMenuStoredList.containsKey("채용공고")) mainMenuList.add(MainMenu.builder().order(3).menu(recruit).url("/recruit/notice").name("채용공고").nameEnglish("Recruitment notice").nameJapanese("採用発表").type(MainMenuType.GENERAL).build());
        if(!mainMenuStoredList.containsKey("채용지원")) mainMenuList.add(MainMenu.builder().order(4).menu(recruit).url("/recruit/apply").name("채용지원").nameEnglish("Recruitment support").nameJapanese("採用支援").type(MainMenuType.GENERAL).build());
        if(!mainMenuStoredList.containsKey("채용문의")) mainMenuList.add(MainMenu.builder().order(5).menu(recruit).url("/recruit/inquire").name("채용문의").nameEnglish("Recruitment Inquiry").nameJapanese("採用お問い合わせ").type(MainMenuType.GENERAL).build());

        // '공지사항' 하위 메뉴
        if(!mainMenuStoredList.containsKey(("공지사항"))) mainMenuList.add(MainMenu.builder().order(1).menu(notice).url("/notice/notice").name(" 공지사항 ").nameEnglish("Announcement").nameJapanese("お知らせ").type(MainMenuType.GENERAL).build());

        // mainMenu 업데이트
        log.info("누락된 하위 메뉴 {}건 추가됨", mainMenuList.size());
        mainMenuRepository.saveAll(mainMenuList);
    }

    // Category entity 추가 (지원분야 설정)
    private void configureSupportMenu() {
        // DB에서 support 불러오기
        Map<String, Category> supportStoredList = new HashMap<>();
        categoryRepository.findAll().forEach(support -> {
            supportStoredList.put(support.getCategoryName(), support);
        });

        // 기존 support 그룹에 추가되어 있지 않은 support라면, supportList에 추가
        List<Category> supportList = new ArrayList<>();
        if(!supportStoredList.containsKey("프런트")) supportList.add(Category.builder().categoryName("프런트").build()); 
        if(!supportStoredList.containsKey("레스토랑")) supportList.add(Category.builder().categoryName("레스토랑").build()); 
        if(!supportStoredList.containsKey("하우스키핑")) supportList.add(Category.builder().categoryName("하우스키핑").build()); 

        // support 업데이트
        log.info("기존 지원분야 {}건 확인", supportStoredList.size());
        log.info("누락된 지원분야 {}건 추가됨", supportList.size());
        categoryRepository.saveAll(supportList);
    }
}
