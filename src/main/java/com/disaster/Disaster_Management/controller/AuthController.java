package com.disaster.Disaster_Management.controller;

import com.disaster.Disaster_Management.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService)
    {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role)
    {
        return authService.register(email, password, role);
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password)
    {
        return authService.login(email, password);
    }
}