package com.enicom.board.kyoritsu.api.param;

import lombok.*;

import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 *  지원자 데이터를 담을 class 정의.
**/

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class ApplicantParam {
    private String key;
    private String passYn;
    private String formTag;
    private String contentsAnswer;
    
    @NotBlank(message = "생년월일은 필수 입력값입니다.")
    private String birthDate;
    @NotNull(message = "채용공고 id는 필수 입력값입니다.")
    private Long jobId;
    @NotBlank(message = "지원분야는 필수 입력값입니다.")
    private String category;
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    private String email;
    @NotBlank(message = "성별은 필수 입력값입니다.")
    private String gender;
    @NotBlank(message = "지원자 이름은 필수 입력값입니다.")
    private String name;
    @NotBlank(message = "내/외국인 여부는 필수 입력값입니다.")
    private String nationality;
    @NotBlank(message = "휴대전화 번호는 필수 입력값입니다.")
    private String phone;
    @NotBlank(message = "경력/신입 여부는 필수 입력값입니다.")
    private String career;
    @NotNull(message = "자기소개서 내용은 null일 수 없습니다.")
    private String contents;

   @JsonIgnore
   public Applicant create(){
       Applicant applicant = Applicant.builder()
               .build();
       applyTo(applicant);
       return applicant;
   }

   @JsonIgnore
   public void applyTo(Applicant applicant) {
       if (this.category != null) {
           applicant.setCategory(this.category);
       }
       if (this.email != null) {
           applicant.setEmail(this.email);
       }
       if (this.gender != null) {
           applicant.setGender(this.gender);
       }
       if (this.name != null) {
           applicant.setName(this.name);
       }
       if (this.nationality != null) {
           applicant.setNationality(this.nationality);
       }
       if (this.phone != null) {
           applicant.setPhone(this.phone);
       }
       if (this.career != null) {
           applicant.setCareer(this.career);
       }
       if (this.contents != null) {
           applicant.setContents(this.contents);
       }
   }
}
