package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.entity.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 *  채용공고 지원분야 데이터를 담을 class 정의.
**/

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class CategoryParam {
    @NotBlank(message = "지원분야 이름은 필수 입력값입니다.")
    private String categoryName;
    private String key;

    @JsonIgnore
    public Category create(){
        Category category = Category.builder()
                .build();
        applyTo(category);
        return category;
    }

    @JsonIgnore
    public void applyTo(Category category) {
        if (this.categoryName != null) {
            category.setCategoryName(this.categoryName);
        }
    }
}
