package com.enicom.board.kyoritsu.api.type;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.enicom.board.kyoritsu.api.vo.InfoVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;

/**
 *  ResponseEntity<ResponseDataValue>를 사용하여 ResponseHandler를 정의.
 *  인자로 (code), (code, body), (ResponseDataValue), (PageVO), (InfoVO)를 받아 ResponseHandler로 만듦.
**/

public class ResponseHandler<T> extends ResponseEntity<ResponseDataValue<?>> {
    // Constructor (code)
    public ResponseHandler(int code) {
        super(ResponseDataValue.builder(code).build(), HttpStatus.OK);
    }
    // Constructor (code, body)
    public ResponseHandler(int code, Object body) {
        super(ResponseDataValue.builder(code, body).build(), HttpStatus.OK);
    }
    // Constructor (ResponseDataValue)
    public ResponseHandler(ResponseDataValue<?> data) {
        super(data, data.getStatus());
    }
    // Constructor (PageVO)
    public ResponseHandler(PageVO<?> page) {
        super(ResponseDataValue.builder(200, page).build(), HttpStatus.OK);
    }
    // Constructor (InfoVO)
    public ResponseHandler(InfoVO<?> info) {
        super(ResponseDataValue.builder(200, info).build(), HttpStatus.OK);
    }
}
