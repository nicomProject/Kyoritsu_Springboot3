package com.enicom.board.kyoritsu.dao.repository.applicant;

import com.enicom.board.kyoritsu.dao.entity.Applicant;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicantRepository extends CrudRepository<Applicant, Long>, ApplicantRepositoryCustom {

    Optional<Applicant> findByRecKey(Long recKey);

    List<Applicant> findAllByRecKeyOrderByRecKey(Long recKey);
}