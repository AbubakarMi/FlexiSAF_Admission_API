package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Announcement;
import com.flexisaf.admissions.exception.ResourceNotFoundException;
import com.flexisaf.admissions.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Transactional(readOnly = true)
    public List<Announcement> getAllAnnouncements() {
        log.info("Fetching all announcements sorted by pinned and creation date");
        return announcementRepository.findAllByOrderByPinnedDescCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Announcement getAnnouncementById(Long id) {
        log.info("Fetching announcement with ID: {}", id);
        return announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Announcement> getAnnouncementsByAudience(Announcement.Audience audience) {
        log.info("Fetching announcements for audience: {}", audience);
        return announcementRepository.findByAudience(audience);
    }

    @Transactional
    public Announcement createAnnouncement(Announcement announcement) {
        log.info("Creating new announcement: {}", announcement.getTitle());

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        log.info("Successfully created announcement with ID: {}", savedAnnouncement.getId());
        return savedAnnouncement;
    }

    @Transactional
    public Announcement updateAnnouncement(Long id, Announcement updatedAnnouncement) {
        log.info("Updating announcement with ID: {}", id);

        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));

        // Update fields
        existingAnnouncement.setTitle(updatedAnnouncement.getTitle());
        existingAnnouncement.setContent(updatedAnnouncement.getContent());
        existingAnnouncement.setAudience(updatedAnnouncement.getAudience());
        existingAnnouncement.setPriority(updatedAnnouncement.getPriority());
        existingAnnouncement.setPinned(updatedAnnouncement.getPinned());

        Announcement saved = announcementRepository.save(existingAnnouncement);
        log.info("Successfully updated announcement with ID: {}", id);
        return saved;
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        log.info("Deleting announcement with ID: {}", id);

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));

        announcementRepository.delete(announcement);
        log.info("Successfully deleted announcement with ID: {}", id);
    }

    @Transactional
    public Announcement togglePin(Long id) {
        log.info("Toggling pin status for announcement with ID: {}", id);

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));

        announcement.setPinned(!announcement.getPinned());

        Announcement saved = announcementRepository.save(announcement);
        log.info("Successfully toggled pin status for announcement with ID: {} - Now pinned: {}",
                id, saved.getPinned());
        return saved;
    }
}
