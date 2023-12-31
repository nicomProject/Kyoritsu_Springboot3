package com.enicom.board.kyoritsu.dao.repository.category;

import com.enicom.board.kyoritsu.dao.entity.Category;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends CrudRepository<Category, Long> {
    
    Optional<Category> findByCategoryName(String categoryName);

    List<Category> findAllByDeleteDateNull();
}
