package com.civicfix.repository;

import com.civicfix.entity.Complaint;
import com.civicfix.entity.User;
import com.civicfix.entity.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenOrderByCreatedAtDesc(User citizen);
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
}
