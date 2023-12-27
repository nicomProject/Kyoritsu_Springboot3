package com.enicom.board.kyoritsu.api.param;

import com.enicom.board.kyoritsu.dao.entity.Notice;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 *  뉴스(공지사항) 요청값을 담을 class 정의.
**/

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class NoticeParam {
    @NotBlank
    private String title;
    @NotBlank
    private String contents;
    private String category;
    private String key;

    @JsonIgnore
    public Notice create(){
        Notice notice = Notice.builder()
                .build();
        applyTo(notice);
        return notice;
    }

    @JsonIgnore
    public void applyTo(Notice notice) {
        if (this.title != null) {
            notice.setTitle(this.title);
        }
        if (this.contents != null) {
            notice.setContent(this.contents);
        }
        if (this.category != null) {
            notice.setCategory(this.category);
        }
    }
}
