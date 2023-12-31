package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.entity.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class CategoryParam {

    private String categoryName;
    private String key;

    @JsonIgnore
    public Category create(){
        Category category = Category.builder()
                .build();
        applyTo(category);
        return category;
    }
    //
    @JsonIgnore
    public void applyTo(Category category) {
        if (this.categoryName != null) {
            category.setCategoryName(this.categoryName);
        }
    }
}
