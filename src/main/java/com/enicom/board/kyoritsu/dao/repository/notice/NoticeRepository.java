package com.enicom.board.kyoritsu.dao.repository.notice;

import com.enicom.board.kyoritsu.dao.entity.Notice;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

/**
 *  Notice entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface NoticeRepository extends CrudRepository<Notice, Long>, NoticeRepositoryCustom {
    // Notice entity에서 delete_date가 null인 record들을 create_date 내림차순으로 정렬하여 반환
    List<Notice> findAllByDeleteDateNullOrderByCreateDateDesc();
    // Notice entity 내의 recKey를 사용하여 Notice entity 찾아 list 형태로 반환
    List<Notice> findAllByRecKey(Long recKey);
    // 해당 recKey를 가지고 있는 Notice entity를 반환
    Optional<Notice> findByRecKey(Long recKey);
}