package com.civicfix.service;

import com.civicfix.dto.AuthRequest;
import com.civicfix.dto.AuthResponse;
import com.civicfix.dto.RegisterRequest;
import com.civicfix.entity.Role;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.RoleType;
import com.civicfix.exception.BadRequestException;
import com.civicfix.repository.RoleRepository;
import com.civicfix.repository.UserRepository;
import com.civicfix.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuditService auditService;

    @Transactional
    public AuthResponse registerCitizen(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        Role citizenRole = roleRepository.findByName(RoleType.ROLE_CITIZEN)
                .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_CITIZEN, "Default Citizen Role")));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress().trim());
        user.setCity(request.getCity().trim());
        user.setArea(request.getArea().trim());
        user.setRole(citizenRole);
        user.setIsActive(true);
        user.setIsSuspended(false);

        User savedUser = userRepository.save(user);

        auditService.log(savedUser.getId(), savedUser.getEmail(), "CITIZEN_REGISTERED", "USER", savedUser.getId().toString(), "New citizen registered successfully", null);

        // Auto authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(),
                citizenRole.getName().name(), null, null);
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (user.getIsSuspended()) {
            throw new BadRequestException("Your account has been suspended by administration. Contact support.");
        }

        Long deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        String deptName = user.getDepartment() != null ? user.getDepartment().getName() : null;

        auditService.log(user.getId(), user.getEmail(), "USER_LOGIN", "USER", user.getId().toString(), "User authenticated into portal", null);

        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getFullName(),
                user.getRole().getName().name(), deptId, deptName);
    }
}
