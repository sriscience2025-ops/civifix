package com.civicfix.repository;

import com.civicfix.entity.Department;
import com.civicfix.entity.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<IssueCategory, Long> {
    Optional<IssueCategory> findByName(String name);
    List<IssueCategory> findByDepartment(Department department);
    List<IssueCategory> findByIsActiveTrue();
}
