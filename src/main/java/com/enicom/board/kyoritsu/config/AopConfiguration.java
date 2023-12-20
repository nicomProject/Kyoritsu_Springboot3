package com.enicom.board.kyoritsu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.enicom.board.kyoritsu.aop.ControllerAspect;

@Configuration
public class AopConfiguration {
    @Bean
    public ControllerAspect controllerAspect() {
        return new ControllerAspect();
    }
}
