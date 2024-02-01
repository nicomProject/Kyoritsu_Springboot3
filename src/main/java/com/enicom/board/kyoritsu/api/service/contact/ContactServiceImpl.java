package com.enicom.board.kyoritsu.api.service.contact;

import com.enicom.board.kyoritsu.api.param.ApplicantParam;
import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.param.ContactParam;
import com.enicom.board.kyoritsu.api.service.applicant.ApplicantService;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.config.EmailConfiguration;
import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.enicom.board.kyoritsu.dao.entity.Job;
import com.enicom.board.kyoritsu.dao.repository.applicant.ApplicantRepository;
import com.enicom.board.kyoritsu.dao.repository.job.JobRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {


    @Override
    public ResponseDataValue<?> add(ContactParam param) {
        EmailConfiguration.sendEmailContact(param);
        return ResponseDataValue.builder(200).build();
    }
}