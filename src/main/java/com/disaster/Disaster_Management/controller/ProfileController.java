package com.disaster.Disaster_Management.controller;

import com.disaster.Disaster_Management.entity.Profile;
import com.disaster.Disaster_Management.service.ProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // Create profile
    @PostMapping
    public Profile create(@RequestBody Profile profile) {
        return profileService.save(profile);
    }

    // Get all profiles
    @GetMapping
    public List<Profile> getAll() {
        return profileService.getAll();
    }

    // Update profile
    @PutMapping("/{id}")
    public Profile update(@PathVariable Long id, @RequestBody Profile profile) {
        return profileService.update(id, profile);
    }

    // Filter by region
    @GetMapping("/region/{region}")
    public List<Profile> getByRegion(@PathVariable String region) {
        return profileService.getByRegion(region);
    }
}
