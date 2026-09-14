package com.civicfix.controller;

import com.civicfix.dto.ApiResponse;
import com.civicfix.entity.Department;
import com.civicfix.entity.IssueCategory;
import com.civicfix.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        List<Department> list = departmentService.getAllActiveDepartments();
        return ResponseEntity.ok(ApiResponse.ok("Departments loaded", list));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<IssueCategory>>> getCategories() {
        List<IssueCategory> list = departmentService.getAllActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok("Categories loaded", list));
    }

    @GetMapping("/departments/{id}/categories")
    public ResponseEntity<ApiResponse<List<IssueCategory>>> getCategoriesByDepartment(@PathVariable Long id) {
        List<IssueCategory> list = departmentService.getCategoriesByDepartment(id);
        return ResponseEntity.ok(ApiResponse.ok("Department categories loaded", list));
    }
}
