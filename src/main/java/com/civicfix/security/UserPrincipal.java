package com.civicfix.security;

import com.civicfix.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private Long id;
    private String email;
    private String fullName;
    private String password;
    private Long departmentId;
    private String departmentName;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isActive;
    private boolean isSuspended;

    public UserPrincipal(Long id, String email, String fullName, String password, Long departmentId, String departmentName,
                         Collection<? extends GrantedAuthority> authorities, boolean isActive, boolean isSuspended) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.authorities = authorities;
        this.isActive = isActive;
        this.isSuspended = isSuspended;
    }

    public static UserPrincipal create(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName().name());
        Long deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        String deptName = user.getDepartment() != null ? user.getDepartment().getName() : null;

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPasswordHash(),
                deptId,
                deptName,
                Collections.singletonList(authority),
                user.getIsActive(),
                user.getIsSuspended()
        );
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public Long getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }

    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return !isSuspended; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return isActive && !isSuspended; }
}
