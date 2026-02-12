package com.disaster.Disaster_Management.service;

import com.disaster.Disaster_Management.entity.Profile;
import com.disaster.Disaster_Management.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Create profile
    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    // Get all profiles
    public List<Profile> getAll() {
        return profileRepository.findAll();
    }

    // Update profile
    public Profile update(Long id, Profile updatedProfile) {
        Optional<Profile> optionalProfile = profileRepository.findById(id);

        if (optionalProfile.isPresent()) {
            Profile existing = optionalProfile.get();
            existing.setFullName(updatedProfile.getFullName());
            existing.setPhone(updatedProfile.getPhone());
            existing.setRegion(updatedProfile.getRegion());

            return profileRepository.save(existing);
        } else {
            return null;
        }
    }

    // Filter by region
    public List<Profile> getByRegion(String region) {
        return profileRepository.findByRegion(region);
    }
}
