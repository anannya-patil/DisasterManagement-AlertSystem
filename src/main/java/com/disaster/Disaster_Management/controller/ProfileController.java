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

    @PostMapping
    public Profile create(@RequestBody Profile profile) {
        return profileService.save(profile);
    }

    @GetMapping
    public List<Profile> getAll() {
        return profileService.getAll();
    }
}
