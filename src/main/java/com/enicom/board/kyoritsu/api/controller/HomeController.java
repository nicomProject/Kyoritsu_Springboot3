package com.enicom.board.kyoritsu.api.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.type.AdminMenuGroupType;
import com.enicom.board.kyoritsu.dao.type.AdminMenuType;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import lombok.RequiredArgsConstructor;

/**
 *  Web HomePage에 대한 resources를 요청받고 처리함.
**/

@Controller
@RequiredArgsConstructor
public class HomeController {
    // field 정의
    private final SecurityUtil securityUtil;

    // [url] : /
    @GetMapping(path = {"/"})
    public String home(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        return "main/index";
    }

    @GetMapping("/index_popup")
    public String showPopup(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        return "main/index_popup";
    }

    // [url] : /{category}/{page}
    @GetMapping(path = {"/{category}/{page}"})
    public String main(@PathVariable String category, @PathVariable String page, Model model, HttpServletRequest request) {
        String menu = category;
        String view = page;
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        return String.format("main/%s/%s", menu, view);
    }

    // [url] : /{category}/{page}/detail/{key}
    @GetMapping("/{category}/{page}/detail/{key}")
    public String mainDetail(Model model, @PathVariable String category, @PathVariable String page, @PathVariable long key, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        model.addAttribute("key", key);
        return String.format("main/detail/%s", page);
    }

    // [url] : /recruit/inquire/{action}/{key}
    // 채용문의에서 자신이 작성한 페이지 접근할 때 사용
    @GetMapping("/recruit/inquire/{action}/{key}")
    public String recruitAction(Model model, @PathVariable String action, @PathVariable long key, HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        model.addAttribute("key", key);
        return String.format("main/recruit/inquire/%s", action);
    }

    // [url] : /recruit/inquire/{action}
    @GetMapping("/recruit/inquire/{action}")
    public String recruitAction(@PathVariable String action, Model model, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        return String.format("main/recruit/inquire/%s", action);
    }

    // [url] : /recruit/notice/{action}/{key}
    // 채용공고에서 채용 상세 페이지 접근할 때 사용
    @GetMapping("/recruit/notice/{action}/{page}")
    public String recruitNoticeAction(Model model, @PathVariable String action, @PathVariable String page, HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        model.addAttribute("key", page);
        return String.format("main/recruit/notice/%s", action);
    }

    // [url] : /recruit/notice/{action}
    @GetMapping("/recruit/notice/{page}")
    public String recruitNoticeAction(@PathVariable String page) {
        return String.format("main/recruit/notice/%s", page);
    }

    // [url] : /recruit/apply/{page}
    @GetMapping("/recruit/apply/{key}")
    public String recruitApplyAction(Model model, @PathVariable long key, HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();
        String language = (String) session.getAttribute("languageValue");
        if(language == null) language = "kr";
        model.addAttribute("language", language);
        model.addAttribute("key", key);
        return String.format("main/recruit/apply");
    }

    // [url] : /admin
    @GetMapping(path = {"/admin"})
    public String admin(Model model) {
        return login(model);
    }

    // [url] : /admin/login
    @GetMapping(path = {"/admin/login"})
    public String login(Model model) {
        MemberDetail member = getCurrentUser(model);

        if(member == null) {
            return "admin/login";
        }

        model.addAttribute("menu_group", AdminMenuGroupType.HOMEPAGE.getName());
        model.addAttribute("menu_name", AdminMenuType.INTRODUCTIONS.getName());

        return "admin/introductions";
    }

    // [url] : /admin/logout
    @GetMapping("/admin/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        new SecurityContextLogoutHandler().logout(request, response,
                SecurityContextHolder.getContext().getAuthentication());
        response.sendRedirect("/admin");
    }

    // [url] : /admin/{page}
    @GetMapping("/admin/{page}")
    public String admin(Model model, HttpServletResponse response, @PathVariable String page) throws IOException {
        MemberDetail member = getCurrentUser(model);
        if (member == null || page.equalsIgnoreCase("login")) {
            response.sendRedirect("/");
        }
        else {
            securityUtil.getMenu(page).ifPresent(menu -> {
                model.addAttribute("menu_group", menu.getGroup().getName());
                model.addAttribute("menu_name", menu.getName());
            });
        }

        String view = page;
        if (page.equalsIgnoreCase("dashboard")) {
            view = "index";
        }

        return String.format("admin/%s", view);
    }

    // [url] : /admin/{page}/detail
    @GetMapping("/admin/{page}/detail")
    public String adminDetail(Model model, HttpServletResponse response, @PathVariable String page) throws IOException {
        MemberDetail member = getCurrentUser(model);
        if (member == null || page.equalsIgnoreCase("login")) {
            response.sendRedirect("/admin");
        }
        else {
            securityUtil.getDetailMenu(page).ifPresent(menu -> {
                model.addAttribute("menu_group", menu.getGroup().getName());
                model.addAttribute("menu_detail_name", menu.getName());
            });
        }

        return String.format("admin/detail/%s", page);
    }

    // [url] : /admin/{page}/detail/{key}
    @GetMapping("/admin/{page}/detail/{key}")
    public String adminDetail(Model model, HttpServletResponse response, @PathVariable String page, @PathVariable String key) throws IOException {
        MemberDetail member = getCurrentUser(model);
        if (member == null || page.equalsIgnoreCase("login")) {
            response.sendRedirect("/admin");
        }
        else {
            securityUtil.getDetailMenu(page).ifPresent(menu -> {
                model.addAttribute("menu_group", menu.getGroup().getName());
                model.addAttribute("menu_detail_name", menu.getName());
            });
        }

        model.addAttribute("key", key);
        return String.format("admin/detail/%s", page);
    }

    // [url] : /modal/{page}
    @GetMapping(path = "/modal/{page}")
    public String modal(@PathVariable String page, Model model, @RequestParam Map<String, Object> paramMap) {
        model.addAttribute(paramMap);
        return String.format("modal/%s", page);
    }

    // [url] : /favicon | /favicon.ico
    @GetMapping(path = {"/favicon", "/favicon.ico"})
    public String favicon() {
        return "forward:/static/images/favicon/favicon.ico";
    }

    // [url] : /error
    @GetMapping(path = {"/error"})
    public String error() {
        return "error";
    }

    // 현재 유저에 대한 정보를 가져오는 함수
    private MemberDetail getCurrentUser(Model model) {
        MemberDetail member = securityUtil.getCurrentUser();

        if(member != null) {
            model.addAttribute("member_id", member.getUsername());
            model.addAttribute("member_name", member.getName());
            model.addAttribute("member_authorities", member.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            return member;
        }

        return null;
    }
}