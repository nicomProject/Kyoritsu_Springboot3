package com.enicom.board.kyoritsu.dao.repository.access;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.AccessLog;

/**
 *  AccessLog entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface AccessLogRepository extends CrudRepository<AccessLog, Long>, AccessLogRepositoryCustom {
    @Override
    List<AccessLog> findAll();
    List<AccessLog> findAllByOrderByLoginDateDesc();
}
