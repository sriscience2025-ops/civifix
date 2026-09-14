package com.civicfix.repository;

import com.civicfix.entity.Feedback;
import com.civicfix.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByIssue(Issue issue);
}
