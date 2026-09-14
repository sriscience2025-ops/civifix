package com.civicfix.repository;

import com.civicfix.entity.Department;
import com.civicfix.entity.Issue;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.IssueStatus;
import com.civicfix.entity.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByTicketNumber(String ticketNumber);
    List<Issue> findByCitizen(User citizen);
    List<Issue> findByDepartment(Department department);
    List<Issue> findByAssignedWorker(User worker);
    List<Issue> findByStatus(IssueStatus status);
    List<Issue> findByDepartmentAndStatus(Department department, IssueStatus status);
    
    @Query("SELECT i FROM Issue i WHERE i.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED', 'CANCELLED') AND i.targetDeadline < :now")
    List<Issue> findOverdueIssues(@Param("now") LocalDateTime now);

    @Query("SELECT i FROM Issue i WHERE i.department = :dept AND i.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED', 'CANCELLED') AND i.targetDeadline < :now")
    List<Issue> findOverdueIssuesByDepartment(@Param("dept") Department dept, @Param("now") LocalDateTime now);

    Long countByStatus(IssueStatus status);
    Long countByDepartment(Department department);
    Long countByDepartmentAndStatus(Department department, IssueStatus status);
    Long countByPriority(Priority priority);

    @Query("SELECT i FROM Issue i WHERE (:status IS NULL OR i.status = :status) " +
           "AND (:priority IS NULL OR i.priority = :priority) " +
           "AND (:deptId IS NULL OR i.department.id = :deptId) " +
           "AND (:searchTerm IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(i.ticketNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Issue> filterIssues(@Param("status") IssueStatus status,
                             @Param("priority") Priority priority,
                             @Param("deptId") Long deptId,
                             @Param("searchTerm") String searchTerm,
                             Pageable pageable);
}
