package com.enicom.board.kyoritsu.api.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;

/**
 *  Custom annotation 정의. @ApiMapping
**/

@Target(METHOD)         // ApiMapping은 METHOD에 사용할 수 있음.
@Retention(RetentionPolicy.RUNTIME) // ApiMapping은 런타임 시에도 유지되도록 함.
public @interface ApiMapping {
    // Annotation attribute 설정
    int order() default 1;
    String desc();
    Class<?> param() default Object.class;
}
