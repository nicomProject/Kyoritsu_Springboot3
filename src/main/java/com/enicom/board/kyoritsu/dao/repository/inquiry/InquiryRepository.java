package com.enicom.board.kyoritsu.dao.repository.inquiry;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.enicom.board.kyoritsu.dao.entity.Inquiry;

public interface InquiryRepository extends CrudRepository<Inquiry, Long>, InquiryRepositoryCustom {
    // Inquiry entity에서 delete_date가 null인 record들을 create_date 내림차순으로 정렬하여 반환
    List<Inquiry> findAllByDeleteDateNullOrderByCreateDateDesc();
    // RecKey가 일치하는 Inquiry entity를 list 형태로 반환
    List<Inquiry> findAllByRecKey(Long recKey);
    // RecKey가 일치하는 Inquiry entity를 Optional 형태로 반환
    Optional<Inquiry> findByRecKey(Long recKey);
}