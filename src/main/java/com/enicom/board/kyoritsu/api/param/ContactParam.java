package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 *  지원자 데이터를 담을 class 정의.
**/

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class ContactParam {


    @NotNull(message = "카테고리 입력은 필수 입력값입니다.")
    private String selectedCategory;
    @NotNull(message = "시설명 입력은 필수 입력값입니다.", groups = MyEntityGroup.class)
    private String selectedFacility;
    @NotNull(message = "시설명 입력은 필수 입력값입니다.", groups = MyEntityGroup.class)
    private String textFacility;
    @NotNull(message = "문의 내용 입력은 필수 입력값입니다.")
    private String textQuestion;
    @NotNull(message = "이메일 주소 입력은 필수 입력값입니다.")
    private String textEmail;
    @NotNull(message = "이메일 주소(재확인) 입력은 필수 입력값입니다.")
    private String textEmailCheck;

    public interface MyEntityGroup {
    }

}
