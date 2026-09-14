package com.civicfix.service;

import com.civicfix.entity.Department;
import com.civicfix.entity.Role;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.RoleType;
import com.civicfix.repository.DepartmentRepository;
import com.civicfix.repository.RoleRepository;
import com.civicfix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<User> getWorkersByDepartment(Long departmentId) {
        Department dept = departmentRepository.findById(departmentId).orElse(null);
        Role workerRole = roleRepository.findByName(RoleType.ROLE_FIELD_WORKER).orElse(null);
        if (dept != null && workerRole != null) {
            return userRepository.findByDepartmentAndRole(dept, workerRole);
        }
        return List.of();
    }

    public List<User> getAllWorkers() {
        Role workerRole = roleRepository.findByName(RoleType.ROLE_FIELD_WORKER).orElse(null);
        if (workerRole != null) {
            return userRepository.findByRole(workerRole);
        }
        return List.of();
    }
}
