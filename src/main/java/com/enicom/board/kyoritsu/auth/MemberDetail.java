package com.enicom.board.kyoritsu.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.enicom.board.kyoritsu.dao.type.RoleType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 *  Spring security의 UserDetails를 구현한 MemberDetail 정의.
**/

@Builder
@Getter
@Setter
@ToString
public class MemberDetail implements UserDetails {
    private String id;
    private String password;

    @Builder.Default
    private String name = "관리자";

    @Builder.Default
    private RoleType role = RoleType.ADMIN;

    @Builder.Default
    private Integer enable = 1;

    @Builder.Default
    private Integer failureCnt = 0;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        Arrays.stream(RoleType.values())
                .filter(r -> r.ordinal() <= role.ordinal())
                .forEach(r -> authorities.add(new SimpleGrantedAuthority(r.getName())));

        return authorities;
    }

    // 가장 낮은 RoleType부터 자신의 RoleType까지 list 형태로 반환
    public List<RoleType> getRoles() {
        return Arrays.stream(RoleType.values()).filter(r -> r.ordinal() <= role.ordinal()).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return failureCnt < 5;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enable == 1;
    }
}