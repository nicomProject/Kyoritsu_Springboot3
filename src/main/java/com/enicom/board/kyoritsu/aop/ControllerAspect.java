package com.enicom.board.kyoritsu.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import com.enicom.board.kyoritsu.utils.Utils;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;

/**
 *  AOP를 사용하여 RestController로 들어오는 모든 요청을 로깅함.
**/

@Aspect
@Slf4j
public class ControllerAspect {
    // RestController에 있는 RequestMapping annotation을 가진 메서드를 대상으로 하는 pointcut 정의
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *) && "
            + "@annotation(requestMapping) && execution(* *(..))")
    private void controller(RequestMapping requestMapping) {
        log.info(requestMapping.toString());
    }

    // 정의한 controller(RequestMapping requestMapping)을 사용하여 요청을 가로채고 로깅하는 advice 정의
    @Around(value = "controller(mapping)", argNames = "pjp,mapping")
    public Object controllerHandler(ProceedingJoinPoint pjp, RequestMapping mapping) {

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ip = Utils.getClientIP(request);

        Object[] args = pjp.getArgs();
        String uri = request.getRequestURI();

        log.info("* REQUEST [url: {}, ip: {}, params: {}]", uri, ip, Arrays.toString(args));

        try {
            return pjp.proceed();
        } catch (Throwable e) {
            e.printStackTrace();
            // 처리 중 오류가 발생하였습니다. (errCode: 400)
            return new ResponseHandler<>(400);
        }
    }
}
