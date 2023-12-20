package com.enicom.board.kyoritsu.aop;

import java.io.IOException;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.enicom.board.kyoritsu.api.type.ResponseHandler;

import lombok.extern.slf4j.Slf4j;

/**
 *  AOP를 사용하여 RestController로 들어오는 모든 요청 중, 비정상적인 input Error를 처리함.
**/

@RestControllerAdvice
@Slf4j
public class ApiExceptionHandler {
    // parameter error 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseHandler<?> parameterError(MethodArgumentNotValidException ex) {
        return new ResponseHandler<>(410);
    }

    // json parsing error 처리
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseHandler<?> jsonParsingError(HttpMessageNotReadableException ex) {
        try {
            log.info("message: {}", ex.getHttpInputMessage().getBody().read());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return new ResponseHandler<>(401);
    }
}
