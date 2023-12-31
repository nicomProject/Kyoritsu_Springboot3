package com.enicom.board.kyoritsu.api.service.category;

import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;

public interface CategoryService {
    PageVO<?> findAll();
    ResponseDataValue<?> add(CategoryParam param);
    ResponseDataValue<?> delete(CategoryParam param); 
}
