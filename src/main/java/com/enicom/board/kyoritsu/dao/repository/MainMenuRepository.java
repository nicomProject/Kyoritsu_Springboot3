package com.enicom.board.kyoritsu.dao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.MainMenu;
import com.enicom.board.kyoritsu.dao.type.MainMenuType;

/**
 *  MainMenu entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface MainMenuRepository extends CrudRepository<MainMenu, Long>{
    // 모든 MainMenu entity를 recKey 기준 오름차순으로 반환
    List<MainMenu> findAllByOrderByRecKey();
    // MainMenu entity에서 type이 일치하는 MainMenu entity 모두 반환
    List<MainMenu> findAllByType(MainMenuType type);
    // MainMenu entity에서 recKey가 일치하는 MainMenu entity 반환
    Optional<MainMenu> findByRecKey(Long recKey);
}
