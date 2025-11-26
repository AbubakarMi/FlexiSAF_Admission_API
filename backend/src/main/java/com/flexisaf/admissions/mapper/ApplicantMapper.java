package com.flexisaf.admissions.mapper;

import com.flexisaf.admissions.dto.ApplicantCreateDTO;
import com.flexisaf.admissions.dto.ApplicantDTO;
import com.flexisaf.admissions.dto.ApplicantUpdateDTO;
import com.flexisaf.admissions.entity.Applicant;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ApplicantMapper {

    ApplicantDTO toDTO(Applicant applicant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "aiHint", ignore = true)
    @Mapping(target = "aiScore", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Applicant toEntity(ApplicantCreateDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "aiHint", ignore = true)
    @Mapping(target = "aiScore", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(ApplicantUpdateDTO dto, @MappingTarget Applicant applicant);
}
