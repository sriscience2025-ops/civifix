package com.civicfix.repository;

import com.civicfix.entity.Issue;
import com.civicfix.entity.IssueFollower;
import com.civicfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueFollowerRepository extends JpaRepository<IssueFollower, Long> {
    List<IssueFollower> findByUserOrderByFollowedAtDesc(User user);
    List<IssueFollower> findByIssue(Issue issue);
    Optional<IssueFollower> findByIssueAndUser(Issue issue, User user);
    Boolean existsByIssueAndUser(Issue issue, User user);
    void deleteByIssueAndUser(Issue issue, User user);
}
