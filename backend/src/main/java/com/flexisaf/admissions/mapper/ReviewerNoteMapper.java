package com.flexisaf.admissions.mapper;

import com.flexisaf.admissions.dto.ReviewerNoteDTO;
import com.flexisaf.admissions.entity.ReviewerNote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewerNoteMapper {

    @Mapping(source = "applicant.id", target = "applicantId")
    @Mapping(target = "reviewerName", expression = "java(reviewerNote.getReviewer().getFirstName() + \" \" + reviewerNote.getReviewer().getLastName())")
    @Mapping(source = "reviewer.email", target = "reviewerEmail")
    ReviewerNoteDTO toDTO(ReviewerNote reviewerNote);
}
