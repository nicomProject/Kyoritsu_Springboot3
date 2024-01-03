package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.entity.Inquiry;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 *  채용문의 요청값을 담을 class 정의.
**/

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class InquiryParam {
    // field 정의
    private String key;
    private String inquiryName;
    private String inquiryPwd;
    private String inquiryPhone;
    private String inquiryEmail;
    private String inquiryContent;
    private String inquiryTitle;
    private String answer;
    private String answerUser;
    private String inquirySecret;

    @JsonIgnore
    public Inquiry create(){
        Inquiry inquiry = Inquiry.builder()
                .build();
        applyTo(inquiry);
        return inquiry;
    }

    @JsonIgnore
    public void applyTo(Inquiry inquiry) {
        if (this.inquiryEmail != null) {
            inquiry.setInquiryEmail(this.inquiryEmail);
        }
        if (this.inquiryPhone != null) {
            inquiry.setInquiryPhone(this.inquiryPhone);
        }
        if (this.inquiryName != null) {
            inquiry.setInquiryName(this.inquiryName);
        }
        if (this.inquiryPwd != null) {
            inquiry.setInquiryPwd(this.inquiryPwd);
        }
        if (this.inquiryContent != null) {
            inquiry.setInquiryContent(this.inquiryContent);
        }
        if (this.inquiryTitle != null) {
            inquiry.setInquiryTitle(this.inquiryTitle);
        }
        if (this.inquirySecret != null) {
            inquiry.setInquirySecret(this.inquirySecret);
        }
        if (this.answer != null) {
            inquiry.setAnswer(this.answer);
        }
    }
}
