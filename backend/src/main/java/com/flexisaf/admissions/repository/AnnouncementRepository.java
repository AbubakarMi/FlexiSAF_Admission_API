package com.flexisaf.admissions.repository;

import com.flexisaf.admissions.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByAudience(Announcement.Audience audience);

    List<Announcement> findByPinned(Boolean pinned);

    List<Announcement> findAllByOrderByPinnedDescCreatedAtDesc();
}
