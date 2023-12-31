package com.enicom.board.kyoritsu.dao.repository.job;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;

public interface JobRepositoryCustom {
    // list 창에서 선택된 job entity를 삭제
    Long deleteListJob(MultipleParam param);
    // 전체 job entity를 삭제
    Long deleteAllJob();
}
