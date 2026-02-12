package com.disaster.Disaster_Management.repository;

import com.disaster.Disaster_Management.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    List<Profile> findByRegion(String region);

}
