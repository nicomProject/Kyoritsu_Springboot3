package com.enicom.board.kyoritsu.api.param;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.enicom.board.kyoritsu.dao.entity.Job;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class JobParam {

    private String title;
    private String contents;
    private String category;
    private String support;
    private String experience;
    private String key;
    private String date_to;
    private String date_from;

    @JsonIgnore
    public Job create(){
        Job job = Job.builder()
                .build();
        applyTo(job);
        return job;
    }

//
    @JsonIgnore
    public void applyTo(Job job) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if (this.title != null) {
            job.setTitle(this.title);
        }
        if (this.contents != null) {
            job.setContent(this.contents);
        }
        if (this.category != null) {
            job.setCategory(this.category);
        }
        if (this.support != null) {
            job.setSupport(this.support);
        }
        if (this.experience != null) {
            job.setExperience(this.experience);
        }

        if (this.date_from != null) {
            LocalDate dateTime = LocalDate.parse(this.date_from, formatter);
            job.setFromDate(dateTime.atStartOfDay());
        }
        if (this.date_from != null) {
            LocalDate dateTime = LocalDate.parse(this.date_to, formatter);
            job.setToDate(dateTime.atStartOfDay());
        }
    }

}
