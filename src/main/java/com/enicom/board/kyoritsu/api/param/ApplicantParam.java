package com.enicom.board.kyoritsu.api.param;

import lombok.*;

import com.enicom.board.kyoritsu.dao.entity.Applicant;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    
    private String birthDate;
    private Long jobId;
    private String category;
    private String email;
    private String gender;
    private String name;
    private String nationality;
    private String phone;
    private String career;
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
