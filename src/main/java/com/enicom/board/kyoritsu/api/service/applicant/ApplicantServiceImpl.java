package com.enicom.board.kyoritsu.api.service.applicant;

import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.enicom.board.kyoritsu.dao.repository.applicant.ApplicantRepository;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import com.enicom.board.kyoritsu.config.EmailConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import com.enicom.board.kyoritsu.dao.repository.job.JobRepository;
import com.enicom.board.kyoritsu.dao.entity.Job;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final SecurityUtil securityUtil;
    private final ApplicantRepository applicantRepository;
    private final JobRepository jobRepository;

    @Autowired
    public ApplicantServiceImpl(ApplicantRepository applicantRepository, JobRepository jobRepository, SecurityUtil securityUtil) {
        this.applicantRepository = applicantRepository;
        this.jobRepository = jobRepository;
        this.securityUtil = securityUtil;
    }

    @Transactional
    @Override
    public PageVO<Applicant> findAll(Long key) {
        return PageVO.builder(applicantRepository.findAllByRecKeyOrderByRecKey(key)).build();
    }

    @Transactional
    @Override
    public PageVO<Applicant> findApplicantWithJob(Long key) {
        return PageVO.builder(applicantRepository.findByJobId(key)).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> add(ApplicantParam param) {
        MemberDetail member = securityUtil.getCurrentUser();

        Optional<Applicant> applicantOptional = applicantRepository.findByRecKey(Long.valueOf(param.getKey()));
        if(!applicantOptional.isPresent()){
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다").build();
        }

        Applicant applicant = applicantOptional.get();
        applicant.setContentAnswer(param.getContentsAnswer());
        applicant.setFormTag(param.getFormTag());
        applicant.setPassYn(param.getPassYn());
        applicant.setAnswerId(member.getId());
        applicantRepository.save(applicant);

        EmailConfiguration.sendEmailAsync(applicant.getEmail(), param.getContentsAnswer());

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> apply(ApplicantParam param) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Optional<Job> jobOptional = jobRepository.findByRecKey(Long.valueOf(param.getJobId()));
        if(!jobOptional.isPresent()){
            return ResponseDataValue.builder(210).desc("잘못된 채용공고 정보입니다.").build();
        }

        Applicant applicant = param.create();
        applicant.setCreateDate(LocalDateTime.now());
        applicant.setBirthDate(LocalDate.parse(param.getBirthDate(), formatter).atStartOfDay());
        applicant.setJobId(jobOptional.get());
        applicantRepository.save(applicant);

        return ResponseDataValue.builder(200).build();
    }
}