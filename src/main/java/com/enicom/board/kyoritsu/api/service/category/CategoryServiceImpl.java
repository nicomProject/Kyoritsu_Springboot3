package com.enicom.board.kyoritsu.api.service.category;

import com.enicom.board.kyoritsu.api.param.CategoryParam;
import com.enicom.board.kyoritsu.api.vo.PageVO;
import com.enicom.board.kyoritsu.api.type.ResponseDataValue;
import com.enicom.board.kyoritsu.dao.entity.Category;
import com.enicom.board.kyoritsu.dao.entity.Job;
import com.enicom.board.kyoritsu.dao.repository.category.CategoryRepository;
import com.enicom.board.kyoritsu.dao.repository.job.JobRepository;
import com.enicom.board.kyoritsu.auth.MemberDetail;
import com.enicom.board.kyoritsu.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final SecurityUtil securityUtil;
    private final CategoryRepository categoryRepository;
    private final JobRepository jobRepository;

    @Override
    public PageVO<Category> findAll() {
        return PageVO.builder(categoryRepository.findAllByDeleteDateNull()).build();
    }

    @Override
    public ResponseDataValue<?> add(CategoryParam param) {
        MemberDetail member = securityUtil.getCurrentUser();
        Optional<Category> categoryOptional = categoryRepository.findByCategoryName(param.getCategoryName());
        if (categoryOptional.isPresent()) {
            // 삭제되었었던 지원분야 카테고리라면, 재사용해서 사용가능하도록 하기
            if(categoryOptional.get().getDeleteDate() != null) {
                Category category = categoryOptional.get();
                category.setDeleteDate(null);
                category.setDeleteUser(null);
                category.setCreateDate(LocalDateTime.now());
                category.setCreateUser(member.getId());
                categoryRepository.save(category);

                return ResponseDataValue.builder(200).build();
            }
            else {
                return ResponseDataValue.builder(403).build();
            }
        }

        Category category = param.create();
        category.setCategoryName(param.getCategoryName());
        category.setCreateDate(LocalDateTime.now());
        category.setCreateUser(member.getId());
        categoryRepository.save(category);

        return ResponseDataValue.builder(200).build();
    }

    @Transactional
    @Override
    public ResponseDataValue<?> delete(CategoryParam param) {
        MemberDetail member = securityUtil.getCurrentUser();

        Optional<Category> categoryOptional = categoryRepository.findByCategoryName(param.getCategoryName());
        if (!categoryOptional.isPresent()) {
            return ResponseDataValue.builder(404).build();
        }
        Category category = categoryOptional.get();

        // tb_job의 support = tb_category의 rec_key
        List<Job> jobList = jobRepository.findBySupport(category.getRecKey().toString());
        System.out.println(jobList.size());
        if (jobList.size() > 0) {
            return ResponseDataValue.builder(411).build();
        }

        category.setDeleteDate(LocalDateTime.now());
        category.setDeleteUser(member.getId());

        return ResponseDataValue.builder(200).build();
    }
}