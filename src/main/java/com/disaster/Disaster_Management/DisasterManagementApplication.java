package com.disaster.Disaster_Management;  // ← Must match folder structure exactly!

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DisasterManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(DisasterManagementApplication.class, args);
    }
}