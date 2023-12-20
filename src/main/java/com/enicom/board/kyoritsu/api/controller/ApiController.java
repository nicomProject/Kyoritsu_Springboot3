package com.enicom.board.kyoritsu.api.controller;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.enicom.board.kyoritsu.api.annotation.ApiMapping;
import com.enicom.board.kyoritsu.api.type.ResponseHandler;
import com.enicom.board.kyoritsu.api.vo.InfoVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.utils.ParamUtil;

import jakarta.validation.constraints.NotNull;

/**
 *  Api로 사용되는 class에 대해 확인할 때 사용.
**/

@RestController
@RequestMapping(path = "/api")
public class ApiController {
    // 확인할 classes 설정
    private static final Class<?>[] classes = {
        ApiController.class,
    };

    // field 정의
    @Value("${system.name}")
    private String name;
    @Value("${system.version}")
    private String version;

    // [url] : /api/list
    @RequestMapping(path = "/list", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseHandler<?> getApiList() {
        // apiList 생성
        List<Map<String, Object>> apiList = new ArrayList<>();
        // classes 값 순회
        for(Class<?> c : classes) {
            // class에 대한 method 추출
            Method[] methods = c.getDeclaredMethods();
            // methods 값 순회
            for(Method m : methods) {
                // method가 RequestMapping annotation을 가지고 있다면,
                if(m.isAnnotationPresent(RequestMapping.class)) {
                    // rm 변수에 해당 annotation 저장
                    RequestMapping rm = m.getAnnotation(RequestMapping.class);
                    // method가 ApiMapping annotation을 가지고 있다면, 
                    if(m.isAnnotationPresent(ApiMapping.class)) {
                        // am 변수에 해당 annotation 저장
                        ApiMapping am = m.getAnnotation(ApiMapping.class);

                        // method 저장할 hashmap 생성
                        Map<String, Object> method = new HashMap<>();
                        // RequestMapping이 붙은 method(rm 변수)의 path를 method에 저장
                        method.put("path",String.join(",", rm.path()));
                        // class가 RequestMapping annotation을 가지고 있다면, 
                        if (c.isAnnotationPresent(RequestMapping.class)) {
                            // cm 변수에 해당 annotation 저장
                            RequestMapping cm = (RequestMapping) c.getAnnotation(RequestMapping.class);
                            // cm의 path를 _path에 저장
                            String _path = Arrays.stream(cm.path()).map(path -> Arrays.stream(rm.path()).map(item -> path + item).collect(Collectors.joining(","))).collect(Collectors.joining(","));
                            // RequestMapping이 붙은 class(cm)의 path를 method에 저장
                            method.put("path", _path);
                        }

                        // column, required를 저장하기 위한 list 생성
                        // column은 notnull이 아닌 field를 저장함.
                        // required는 notnull인 field를 저장함.
                        List<String> column = Collections.emptyList();
                        List<String> required = Collections.emptyList();
                        // am의 param이 Object class가 아니라면, 
                        if (!am.param().equals(Object.class)) {
                            // field를 저장할 list 생성
                            List<Field> fields = new ArrayList<>();
                            // am의 param이 특정 class를 상속하고 있다면,
                            if (!am.param().getSuperclass().equals(Object.class)) {
                                // 상속하고 있는 class의 field 저장
                                fields.addAll(Arrays.asList(am.param().getSuperclass().getDeclaredFields()));
                            }
                            // am 자신의 field 저장
                            fields.addAll(Arrays.asList(am.param().getDeclaredFields()));

                            // column에 notnull이 아닌 field를 저장
                            column = fields.stream().filter(field -> !field.isAnnotationPresent(NotNull.class)).map(Field::getName).collect(Collectors.toList());
                            // required에 notnull인 field를 저장
                            required = fields.stream().filter(field -> field.isAnnotationPresent(NotNull.class)).map(Field::getName).collect(Collectors.toList());
                        }
                        
                        // method에 추출한 정보들 저장
                        method.put("method", rm.method());
                        method.put("class", c.getName());
                        method.put("desc", am.desc());
                        method.put("required", required);
                        method.put("column", column);
                        method.put("RequestBody", required.size() + column.size() > 0);
                        method.put("order", am.order());
                        method.put("body", Arrays.stream(m.getParameters()).anyMatch(p -> p.isAnnotationPresent(RequestBody.class)));

                        // apiList에 method 추가
                        apiList.add(method);
                    }
                }
            }

        }

        // ApiMapping의 order 순으로 정렬
        apiList.sort((o1, o2) -> {
            int or1 = ParamUtil.parseInt(o1.get("order"));
            int or2 = ParamUtil.parseInt(o2.get("order"));
            return Integer.compare(or1, or2);
        });

        // 반환
        return new ResponseHandler<>(PageVO.builder(apiList).build());
    }

    // [url] : /api/info
    @RequestMapping(path = "/info", method={RequestMethod.GET, RequestMethod.POST})
    @ApiMapping(order = 0, desc = "[조회] API 정보 조회")
    public ResponseHandler<?> getApiInfo() {
        // result HashMap 생성
        Map<String, Object> result = new HashMap<>();
        // CODE, name, version 명시
        result.put("CODE", "200");
        result.put("name", name);
        result.put("version", version);
        // 반환
        return new ResponseHandler<>(InfoVO.builder(result).build());
    }
}
