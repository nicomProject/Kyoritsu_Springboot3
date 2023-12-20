package com.enicom.board.kyoritsu.api.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
    public String home(Model model) {
        return "main/index";
    }

    // [url] : /{category}/{page}
    @GetMapping(path = {"/{category}/{page}"})
    public String main(@PathVariable String category, @PathVariable String page) {
        String menu = category;
        String view = page;
        return String.format("main/%s/%s", menu, view);
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

    // 현재 유저에 대한 정보를 가져옴
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
