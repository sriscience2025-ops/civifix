package com.civicfix.repository;

import com.civicfix.entity.Issue;
import com.civicfix.entity.IssueAssignment;
import com.civicfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueAssignmentRepository extends JpaRepository<IssueAssignment, Long> {
    List<IssueAssignment> findByIssue(Issue issue);
    List<IssueAssignment> findByWorkerOrderByCreatedAtDesc(User worker);
}
