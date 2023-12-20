package com.enicom.board.kyoritsu.dao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.AdminMenu;
import com.enicom.board.kyoritsu.dao.type.AdminMenuType;

/**
 *  AdminMenu entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface AdminMenuRepository extends CrudRepository<AdminMenu, String>{
    // AdminMenu entity 내에 있는 order_seq 오름차순으로 모든 AdminMenu entity 반환
    List<AdminMenu> findAllByOrderByOrderSeqAsc();
    // AdminMenu entity 내에 있는 code 값으로 AdminMenu entity를 찾음
    Optional<AdminMenu> findByCode(AdminMenuType code);
    // AdminMenu entity 내에 있는 code_detail 값으로 AdminMenu entity를 찾음
    Optional<AdminMenu> findByCodeDetail(String code);
}
