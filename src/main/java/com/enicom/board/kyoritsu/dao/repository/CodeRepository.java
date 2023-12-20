package com.enicom.board.kyoritsu.dao.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.Code;
import com.enicom.board.kyoritsu.dao.id.CodeId;
import com.enicom.board.kyoritsu.dao.type.CodeGroupType;

/**
 *  Code entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface CodeRepository extends CrudRepository<Code, CodeId>{
    // Code entity 내에 있는 column(group, code)을 통해 Code 객체를 찾음
    Optional<Code> findByGroupAndCode(CodeGroupType group, String code);
}