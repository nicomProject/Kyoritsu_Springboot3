package com.enicom.board.kyoritsu.api.service.notice;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.param.NoticeParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleType;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.InfoVO;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.Notice;
import com.enicom.board.kyoritsu.dao.repository.notice.NoticeRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {
    private final SecurityUtil securityUtil;
    private final NoticeRepository noticeRepository;

    @Transactional
    @Override
    public ResponseDataValue<?> add(NoticeParam param) {
        MemberDetail member = securityUtil.getCurrentUser();

        Notice notice = param.create();
        notice.setCreateDate(LocalDateTime.now());
        notice.setCreateUser(member.getId());
        noticeRepository.save(notice);

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public PageVO<Notice> findAll() {
        return PageVO.builder(noticeRepository.findAllByDeleteDateNullOrderByCreateDateDesc()).build();
    }

    @Override
    public PageVO<Notice> findAll(NoticeParam param) {
        return PageVO.builder(noticeRepository.findAllByRecKey(Long.valueOf(param.getKey()))).build();
    }

    @Transactional
    @Override
    public InfoVO<Notice> findBy(Long recKey) {
        Optional<Notice> noticeOptional = noticeRepository.findByRecKey(recKey);
        if(noticeOptional.isPresent()) {
            Notice notice = noticeOptional.get();
            notice.setHit(notice.getHit()+1);
            noticeRepository.save(notice);

            return InfoVO.builder(notice).build();
        }

        return InfoVO.builder(Notice.builder().build()).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> delete(MultipleParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        MultipleType type = param.getType();

        if (type.equals(MultipleType.ONE)) {
            Optional<Notice> noticeOptional = noticeRepository.findByRecKey(Long.valueOf(param.getId()));
            if (noticeOptional.isPresent()) {
                Notice notice = noticeOptional.get();
                notice.setDeleteDate(LocalDateTime.now());
                notice.setDeleteUser(member.getId());

                noticeRepository.save(notice);
            }
        }
        else if (type.equals(MultipleType.LIST)) {
            noticeRepository.deleteListContent(param);
        }
        else if(type.equals(MultipleType.SPECIFIC)){
            noticeRepository.deleteAllContent();
        }

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> update(NoticeParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        Optional<Notice> noticeOptional = noticeRepository.findByRecKey(Long.valueOf(param.getKey()));
        if (!noticeOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }

        Notice notice = noticeOptional.get();
        param.applyTo(notice);
        notice.setEditUser(member.getId());
        notice.setEditDate(LocalDateTime.now());

        noticeRepository.save(notice);

        return ResponseDataValue.builder(200).build();
    }
}
