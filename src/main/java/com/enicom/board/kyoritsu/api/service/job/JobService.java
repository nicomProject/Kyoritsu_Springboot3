package com.enicom.board.kyoritsu.api.service.job;

import com.enicom.board.kyoritsu.api.param.JobParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;

public interface JobService {
    PageVO<?> findAll();
    PageVO<?> findAll(JobParam param);
    PageVO<?> findSearch(JobParam param);
    ResponseDataValue<?> add(JobParam param);
    ResponseDataValue<?> update(JobParam param);
    ResponseDataValue<?> delete(MultipleParam param);
    PageVO<?> findAllCategory(JobParam param);  
}
