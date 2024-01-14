package com.enicom.board.kyoritsu.api.param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

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
    private String date_to;
    private String date_from;

    @JsonIgnore
    public Notice create(){
        Notice notice = Notice.builder()
                .build();
        applyTo(notice);
        return notice;
    }

    @JsonIgnore
    public void applyTo(Notice notice) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalTime dayEndTime = LocalTime.of(23, 59, 59);

        if (this.title != null) {
            notice.setTitle(this.title);
        }
        if (this.contents != null) {
            notice.setContent(this.contents);
        }
        if (this.category != null) {
            notice.setCategory(this.category);
        }
        if (this.date_to != null) {
            LocalDate dateTime = LocalDate.parse(this.date_to, formatter);
            notice.setToDate(LocalDateTime.of(dateTime, dayEndTime));
        }
        if (this.date_from != null) {
            LocalDate dateTime = LocalDate.parse(this.date_from, formatter);
            notice.setFromDate(dateTime.atStartOfDay());
        }
    }
}
