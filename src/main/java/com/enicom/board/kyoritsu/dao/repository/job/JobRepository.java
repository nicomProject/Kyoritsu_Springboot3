package com.enicom.board.kyoritsu.dao.repository.job;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.Job;

/**
 *  Job entity를 사용하여 CRUD를 실시하는 Repository
**/

public interface JobRepository extends CrudRepository<Job, Long>, JobRepositoryCustom {
    // Job entity 내의 deleteDate값이 null이 아닌 모든 Job 반환
    List<Job> findAllByDeleteDateNull();
    List<Job> findAllByDeleteDateIsNullOrderByRecKey();
    // Job entity 내의 recKey를 사용하여 Job entity 찾아 반환
    List<Job> findAllByRecKey(Long recKey);
    Optional<Job> findByRecKey(Long recKey);
    List<Job> findAllByDeleteDateNullAndCategory(String category);
    List<Job> findByTitleContainingAndDeleteDateNullOrderByRecKey(String title);
}
