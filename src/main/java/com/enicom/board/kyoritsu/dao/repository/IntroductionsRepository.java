package com.enicom.board.kyoritsu.dao.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.Content;

/**
 *  Content entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface IntroductionsRepository extends CrudRepository<Content, Long> {
    // Content entity 내의 deleteDate값이 null이 아닌 모든 Content 반환
    List<Content> findAllByDeleteDateNull();
}
