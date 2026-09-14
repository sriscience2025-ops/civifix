package com.civicfix.repository;

import com.civicfix.entity.Issue;
import com.civicfix.entity.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    List<IssueStatusHistory> findByIssueOrderByCreatedAtAsc(Issue issue);
}
