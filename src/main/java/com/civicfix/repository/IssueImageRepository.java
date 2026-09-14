package com.civicfix.repository;

import com.civicfix.entity.Issue;
import com.civicfix.entity.IssueImage;
import com.civicfix.entity.enums.ImageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueImageRepository extends JpaRepository<IssueImage, Long> {
    List<IssueImage> findByIssue(Issue issue);
    List<IssueImage> findByIssueAndImageType(Issue issue, ImageType imageType);
}
