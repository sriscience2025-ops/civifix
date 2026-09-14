package com.civicfix.service;

import com.civicfix.entity.Department;
import com.civicfix.entity.IssueCategory;
import com.civicfix.repository.CategoryRepository;
import com.civicfix.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Department> getAllActiveDepartments() {
        return departmentRepository.findByIsActiveTrue();
    }

    public List<IssueCategory> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    public List<IssueCategory> getCategoriesByDepartment(Long departmentId) {
        Department dept = departmentRepository.findById(departmentId).orElse(null);
        if (dept != null) {
            return categoryRepository.findByDepartment(dept);
        }
        return List.of();
    }
}
