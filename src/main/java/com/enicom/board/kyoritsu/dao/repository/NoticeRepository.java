package com.enicom.board.kyoritsu.dao.repository;

import com.enicom.board.kyoritsu.dao.entity.Notice;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NoticeRepository extends CrudRepository<Notice, Long> {
    // Notice entity에서 delete_date가 null인 record들을 create_date 내림차순으로 정렬하여 반환
    List<Notice> findAllByDeleteDateNullOrderByCreateDateDesc();
}