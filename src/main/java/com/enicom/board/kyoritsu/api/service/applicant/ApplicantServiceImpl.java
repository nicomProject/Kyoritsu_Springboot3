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
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
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

        EmailConfiguration.sendEmailAsync(applicant.getEmail(), param.getContentsAnswer(), "add");

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

        // applicant 저장
        Applicant savedApplicant = applicantRepository.save(applicant);

        // 현재 저장한 applicant의 reckey 추출
        Long recKey = savedApplicant.getRecKey();

        // 메일 작성
        String answer = "";
        answer += "지원 공고명: " + jobOptional.get().getTitle() + "\n";
        answer += "지원자 성함: " + param.getName() + "\n";
        answer += "지원자 휴대번호: " + param.getPhone() + "\n";

        // 메일 전송
        EmailConfiguration.sendEmailAsync(applicant.getEmail(), answer, "apply");

        // statusCode: 200 & applicant recKey 반환
        return ResponseDataValue.builder(200, recKey).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> applyFiles(Long recKey, String applicantName, MultipartFile profile, MultipartFile[] files) {
        // profile 위치
        File folderProfile = new File("./storage/profiles/"+recKey+"_"+applicantName);
        // files 위치
        File folderFiles = new File("./storage/files/"+recKey+"_"+applicantName);

        // 폴더가 없다면 생성
        if(!folderProfile.exists()) {
            folderProfile.mkdirs();
        }
        if(files != null && !folderFiles.exists()) {
            folderFiles.mkdirs();
        }

        // profile 및 files 경로
        String profilePath = "";
        List<String> filesPath = new ArrayList<>();

        // 프로필 데이터를 서버에 파일로 저장
        try {
            byte[] profileData = profile.getBytes();

            try {
                profilePath = String.format("%s/%s", folderProfile.getPath(), profile.getOriginalFilename());
                File file = new File(profilePath);
                FileOutputStream fos = new FileOutputStream(file);
                fos.write(profileData);
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 파일 데이터를 서버에 파일로 저장
        try {
            // 파일이 있다면 진행
            if(files != null){
                for(MultipartFile file : files) {
                    byte[] fileData = file.getBytes();

                    try {
                        String filePath = String.format("%s/%s", folderFiles.getPath(), file.getOriginalFilename());
                        filesPath.add(filePath);
                        File f = new File(filePath);
                        FileOutputStream fos = new FileOutputStream(f);
                        fos.write(fileData);
                        fos.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 해당하는 Applicant 찾아서 DB에 경로 저장
        Applicant applicant = applicantRepository.findById(recKey).orElse(null);
        applicant.setProfilePath(profilePath);
        applicant.setFilesPath(filesPath.toArray(new String[0]));
        applicantRepository.save(applicant);

        return ResponseDataValue.builder(200).build();
    }
}