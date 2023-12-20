package com.enicom.board.kyoritsu.dao.repository;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.AdminMenuGroup;

/**
 *  AdminMenuGroup entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface AdminMenuGroupRepository extends CrudRepository<AdminMenuGroup, String>{}