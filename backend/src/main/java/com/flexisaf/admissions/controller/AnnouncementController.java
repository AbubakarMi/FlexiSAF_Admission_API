package com.flexisaf.admissions.controller;

import com.flexisaf.admissions.entity.Announcement;
import com.flexisaf.admissions.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcements", description = "Announcement management endpoints")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all announcements", description = "Retrieve all announcements sorted by pinned status and creation date")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get announcement by ID", description = "Retrieve a specific announcement by its ID")
    public ResponseEntity<Announcement> getAnnouncementById(
            @Parameter(description = "Announcement ID") @PathVariable Long id) {
        Announcement announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcement);
    }

    @GetMapping("/audience/{audience}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get announcements by audience", description = "Filter announcements by target audience")
    public ResponseEntity<List<Announcement>> getAnnouncementsByAudience(
            @Parameter(description = "Target audience: ALL, STUDENTS, APPLICANTS") @PathVariable Announcement.Audience audience) {
        List<Announcement> announcements = announcementService.getAnnouncementsByAudience(audience);
        return ResponseEntity.ok(announcements);
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create announcement", description = "Create a new announcement")
    public ResponseEntity<Announcement> createAnnouncement(@Valid @RequestBody Announcement announcement) {
        Announcement createdAnnouncement = announcementService.createAnnouncement(announcement);
        return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update announcement", description = "Update an existing announcement")
    public ResponseEntity<Announcement> updateAnnouncement(
            @Parameter(description = "Announcement ID") @PathVariable Long id,
            @Valid @RequestBody Announcement announcement) {
        Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, announcement);
        return ResponseEntity.ok(updatedAnnouncement);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete announcement", description = "Delete an announcement by ID")
    public ResponseEntity<Void> deleteAnnouncement(
            @Parameter(description = "Announcement ID") @PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-pin")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle pin status", description = "Toggle the pinned status of an announcement")
    public ResponseEntity<Announcement> togglePin(
            @Parameter(description = "Announcement ID") @PathVariable Long id) {
        Announcement announcement = announcementService.togglePin(id);
        return ResponseEntity.ok(announcement);
    }
}
