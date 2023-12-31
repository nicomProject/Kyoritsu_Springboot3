package com.enicom.board.kyoritsu.api.service.inquiry;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.param.InquiryParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleType;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.config.EmailConfiguration;
import com.enicom.board.kyoritsu.dao.entity.Inquiry;
import com.enicom.board.kyoritsu.dao.repository.inquiry.InquiryRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {
    private final InquiryRepository inquiryRepository;
    private final SecurityUtil securityUtil;

    // delete_date=null인 모든 Inquiry entity를 create_date 내림차순으로 정렬하여 반환
    @Transactional
    @Override
    public PageVO<Inquiry> findAll() {
        return PageVO.builder(inquiryRepository.findAllByDeleteDateNullOrderByCreateDateDesc()).build();
    }

    // key에 해당하는 Inquiry entity를 찾아 반환
    @Transactional
    @Override
    public PageVO<Inquiry> findAll(Long key) {
        Optional<Inquiry> inquiryOptional = inquiryRepository.findByRecKey(key);

        if(inquiryOptional.isPresent()){
            Inquiry inquiry = inquiryOptional.get();
            inquiry.setHit(inquiry.getHit() + 1);
            inquiryRepository.save(inquiry);

            return PageVO.builder(inquiry).build();
        }

        return PageVO.builder(inquiryRepository.findAllByRecKey(key)).build();
    }

    @Transactional
    @Override
    public PageVO<Inquiry> findAll(InquiryParam param) {
        return PageVO.builder(inquiryRepository.findAllByRecKey(Long.valueOf(param.getKey()))).build();
    }

    // key에 해당하는 Inquiry entity를 찾아 반환
    // pwd 확인을 위해 사용됨
    @Override
    public PageVO<Inquiry> findAllSelfPwd(Long key) {
        return PageVO.builder(inquiryRepository.findAllByRecKey(key)).build();
    }

    // param으로 들어온 값들을 사용하여 Inquiry entity 제작 후 save
    @Override
    public ResponseDataValue<?> add(InquiryParam param) {
        Inquiry inquiry = param.create();
        param.applyTo(inquiry);
        inquiry.setCreateDate(LocalDateTime.now());

        inquiryRepository.save(inquiry);

        return ResponseDataValue.builder(200).build();
    }

    // param으로 들어온 값들을 사용하여 Inquiry entity 에 answer 추가 후 save
    @Transactional
    @Override
    public ResponseDataValue<?> addAnswer(InquiryParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        Optional<Inquiry> inquiryOptional = inquiryRepository.findByRecKey(Long.valueOf(param.getKey()));
        if(!inquiryOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }

        Inquiry inquiry = inquiryOptional.get();
        inquiry.setAnswerDate(LocalDateTime.now());
        inquiry.setAnswerUser(member.getId());
        inquiry.setAnswer(param.getAnswer());
        inquiry.setAnswerYn("답변완료");

        inquiryRepository.save(inquiry);

        EmailConfiguration.sendEmailAsync(inquiry.getInquiryEmail(), param.getAnswer(), "inquiry");

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> update(InquiryParam param) {
        Optional<Inquiry> inquiryOptional = inquiryRepository.findByRecKey(Long.valueOf(param.getKey()));
        if(!inquiryOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }

        Inquiry inquiry = inquiryOptional.get();
        param.applyTo(inquiry);
        inquiry.setUpdateDate(LocalDateTime.now());

        inquiryRepository.save(inquiry);

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> delete(MultipleParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        MultipleType type = param.getType();

        if(type.equals(MultipleType.ONE)) {
            Optional<Inquiry> inquiryOptional = inquiryRepository.findByRecKey(Long.valueOf(param.getKey()));
            if(inquiryOptional.isPresent()) {
                Inquiry inquiry = inquiryOptional.get();
                inquiry.setDeleteDate(LocalDateTime.now());
                // 사용자가 삭제할 경우, '<user>' 값이 deleteUser에 저장
                if(member == null) inquiry.setDeleteUser("<user>");
                // 관리자가 삭제할 경우, 관리자명을 deleteUser에 저장
                else inquiry.setDeleteUser(member.getId());

                inquiryRepository.save(inquiry);
            }
        }
        else if(type.equals(MultipleType.LIST)) {
            inquiryRepository.deleteListContent(param);
        }
        else if(type.equals(MultipleType.SPECIFIC)) {
            inquiryRepository.deleteAllContent();
        }

        return ResponseDataValue.builder(200).build();
    }

    
}
