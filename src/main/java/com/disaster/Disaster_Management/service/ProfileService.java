package com.disaster.Disaster_Management.service;

import com.disaster.Disaster_Management.entity.Profile;
import com.disaster.Disaster_Management.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    public List<Profile> getAll() {
        return profileRepository.findAll();
    }
}
