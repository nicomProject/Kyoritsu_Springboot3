package com.enicom.board.kyoritsu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.enicom.board.kyoritsu.auth.CustomAuthenticationProvider;
import com.enicom.board.kyoritsu.auth.LoginFailureHandler;
import com.enicom.board.kyoritsu.auth.LoginSuccessHandler;
import com.enicom.board.kyoritsu.dao.type.RoleType;

/**
 *  Security 관련 사용할 패키지를 Spring bean으로 등록하는 곳.
**/

@Configuration
@EnableWebSecurity
@ComponentScan("com.nicom.board.kyoritsu")
public class SecurityConfiguration {
    // sessionRegistry를 bean으로 등록
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
    // BCryptPasswordEncoder를 bean으로 등록
    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
    // LoginSuccessHandler를 bean으로 등록
    @Bean
    public LoginSuccessHandler successHandler() {
        return new LoginSuccessHandler();
    }
    // LoginFailureHandler를 bean으로 등록
    @Bean
    public LoginFailureHandler failureHandler() {
        return new LoginFailureHandler();
    }
    // AuthenticationProvider를 bean으로 등록
    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new CustomAuthenticationProvider();
    }
    // AuthenticationManager를 bean으로 등록
    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authenticationProvider());
        return authenticationManagerBuilder.build();
    }
    // filterChain을 bean으로 등록
    // The method headers() from the type HttpSecurity has been deprecated since version 6.1 문제로 인해 lambda식으로 재작성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headerConfig -> 
                headerConfig
                    .frameOptions(frameOptionsConfig -> 
                        frameOptionsConfig.sameOrigin() // 'X-Frame-Options'를 'SAMEORIGIN'
                    )
                    // Spring security 6.1 부터 xssProtection()이 권장되지 않음. [따라서 CSP로 구성하여 XSS 공격을 방지함](아직안함)
                    // .xssProtection()
                    // .contentSecurityPolicy(CSPConfig -> 
                    //     CSPConfig.policyDirectives("script-src 'self'; object-src 'none';")
                    // )
            )
            .authenticationManager(authManager(http))
            .authorizeHttpRequests(authorizeHttpRequestsConfig -> 
                authorizeHttpRequestsConfig
                    .requestMatchers("/admin/**").hasRole(RoleType.USER.name())
                    .requestMatchers("/api/**","/static/**","/**")
                    .permitAll()
            )
            .formLogin(formLoginConfig -> 
                formLoginConfig
                    .loginPage("/admin/login")
                    .usernameParameter("userName")
                    .passwordParameter("userPwd")
                    .loginProcessingUrl("/api/admin/authenticate")
                    .defaultSuccessUrl("/admin")
                    .successHandler(successHandler())
                    .failureHandler(failureHandler())
                    .permitAll()
            )
            .csrf(csrfConfig -> 
                csrfConfig.ignoringRequestMatchers("/api/**")
            )
            .logout(logoutConfig ->
                logoutConfig
                    .logoutRequestMatcher(new AntPathRequestMatcher("/admin/logout"))
                    .logoutSuccessUrl("/admin")
                    .invalidateHttpSession(true)
            )
            .exceptionHandling(exceptionHandlingConfig -> 
                exceptionHandlingConfig.accessDeniedPage("/error")
            )
            .sessionManagement(sessionManagementConfig -> 
                sessionManagementConfig
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(true)
                    .sessionRegistry(sessionRegistry())
                    .expiredSessionStrategy(event -> {
                        event.getSessionInformation().expireNow();
                    })
            );

        return http.build();
    }

}