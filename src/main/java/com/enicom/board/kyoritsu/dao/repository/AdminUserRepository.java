package com.enicom.board.kyoritsu.dao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.AdminUser;
import com.enicom.board.kyoritsu.dao.type.RoleType;

/**
 *  AdminUser entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface AdminUserRepository extends CrudRepository<AdminUser, Long>{
    // AdminUser entity 내에 있는 userId 값으로 AdminUser entity를 찾음
    Optional<AdminUser> findByUserId(String userId);
    // roles 리스트에 포함된 역할 중 하나라도 일치하는 모든 AdminUser entity 반환
    List<AdminUser> findAllByRoleIn(List<RoleType> roles);
    // AdminMenu entity 내에 있는 deleteDate가 null인 모든 AdminUser entity 반환
    List<AdminUser> findAllByDeleteDateNullOrderByRecKey();
    // ids 리스트에 포함된 userId 중 하나라도 일치하는 모든 AdminUser entity 반환
    List<AdminUser> findAllByUserIdIn(List<String> ids);
    // AdminUser entity 내에 있는 reckey 값으로 AdminUser entity를 찾아 List로 반환
    List<AdminUser> findAllByRecKey(Long recKey);
    // AdminUser entity 내에 있는 reckey 값으로 AdminUser entity를 찾아 반환
    Optional<AdminUser> findByRecKey(Long recKey);
    // recKey 리스트에 포함된 recKey 중 하나라도 일치하는 모든 AdminUser entity 삭제
    void deleteByRecKeyIn(List<Long> recKey);
    // AdminUser entity 내에 있는 userId가 인자로 받은 userId와 일치한다면, 모든 해당 AdminUser entity를 삭제
    void deleteByUserId(String userId);
    // ids 리스트에 포함된 userId 중 하나라도 일치하는 모든 AdminUser entity를 삭제
    void deleteAllByUserIdIn(List<String> ids);
}