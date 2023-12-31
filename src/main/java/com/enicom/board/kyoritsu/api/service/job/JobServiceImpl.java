package com.enicom.board.kyoritsu.api.service.job;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.param.JobParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleType;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.Job;
import com.enicom.board.kyoritsu.dao.repository.job.JobRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
    private final SecurityUtil securityUtil;
    private final JobRepository jobRepository;

    @Transactional
    @Override
    public PageVO<Job> findAll() {
        return PageVO.builder(jobRepository.findAllByDeleteDateNull()).build();
    }

    @Transactional
    @Override
    public PageVO<Job> findAll(JobParam param) {
        return PageVO.builder(jobRepository.findAllByRecKey(Long.valueOf(param.getKey()))).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> add(JobParam param) {
        MemberDetail member = securityUtil.getCurrentUser();

        Job job = param.create();
        job.setCreateDate(LocalDateTime.now());
        job.setCreateUser(member.getId());
        jobRepository.save(job);

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> update(JobParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        
        Optional<Job> jobOptional = jobRepository.findByRecKey(Long.valueOf(param.getKey()));
        if (!jobOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }

        Job job = jobOptional.get();
        param.applyTo(job);
        job.setEditUser(member.getId());
        job.setEditDate(LocalDateTime.now());

        jobRepository.save(job);

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> delete(MultipleParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        MultipleType type = param.getType();

        if (type.equals(MultipleType.ONE)) {
            Optional<Job> jobOptional = jobRepository.findByRecKey(Long.valueOf(param.getId()));
            if (jobOptional.isPresent()) {
                Job job = jobOptional.get();
                job.setDeleteDate(LocalDateTime.now());
                job.setDeleteUser(member.getId());
            }
        }
        else if (type.equals(MultipleType.LIST)) {
            jobRepository.deleteListJob(param);
        }
        else if(type.equals(MultipleType.SPECIFIC)){
            jobRepository.deleteAllJob();
        }

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public PageVO<Job> findAllCategory(JobParam param) {
        if(param.getCategory().equals("total")){
            return PageVO.builder(jobRepository.findAllByDeleteDateNull()).build();
        }
        else {
            return PageVO.builder(jobRepository.findAllByDeleteDateNullAndCategory(param.getCategory())).build();
        }
    }

    @Transactional
    @Override
    public PageVO<Job> findSearch(JobParam param) {
        return PageVO.builder(jobRepository.findByTitleContainingAndDeleteDateNull(param.getTitle())).build();
    }
}
