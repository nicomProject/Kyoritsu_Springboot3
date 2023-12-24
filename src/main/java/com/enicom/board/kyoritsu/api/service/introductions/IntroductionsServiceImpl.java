package com.enicom.board.kyoritsu.api.service.introductions;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.enicom.board.kyoritsu.api.param.IntroductionsParam;
import com.enicom.board.kyoritsu.api.param.multiple.MultipleParam;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.dao.entity.Content;
import com.enicom.board.kyoritsu.dao.entity.MainMenu;
import com.enicom.board.kyoritsu.dao.repository.IntroductionsRepository;
import com.enicom.board.kyoritsu.dao.repository.MainMenuRepository;
import com.enicom.board.kyoritsu.utils.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IntroductionsServiceImpl implements IntroductionsService {
    private final SecurityUtil securityUtil;
    private final IntroductionsRepository introductionsRepository;
    private final MainMenuRepository mainMenuRepository;

    @Transactional
    @Override
    public PageVO<Content> findAll() {
        return PageVO.builder(introductionsRepository.findAllByDeleteDateNull()).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> add(IntroductionsParam param) {
        MemberDetail member = securityUtil.getCurrentUser();

        Content content = param.create();
        content.setCreateDate(LocalDateTime.now());
        content.setCreateUser(member.getId());
        introductionsRepository.save(content);

        return ResponseDataValue.builder(200).build();
    }

    @Override
    public ResponseDataValue<?> update(IntroductionsParam param) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public ResponseDataValue<?> delete(MultipleParam param) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    @Transactional
    @Override
    public ResponseDataValue<?> check(MultipleParam param) {
        Optional<Content> contentOptional = introductionsRepository.findByRecKey(param.getIdListLong().get(0));
        if (!contentOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }
        Optional<MainMenu> mainMenuOptional = mainMenuRepository.findByRecKey(Long.valueOf(contentOptional.get().getSubcategory()));
        if (!mainMenuOptional.isPresent()) {
            return ResponseDataValue.builder(210).desc("잘못된 등록번호입니다.").build();
        }
        else {
            MainMenu mainMenu = mainMenuOptional.get();
            mainMenu.setContent(contentOptional.get());

            mainMenuRepository.save(mainMenu);
        }
        return ResponseDataValue.builder(200).build();
    }
    
}
