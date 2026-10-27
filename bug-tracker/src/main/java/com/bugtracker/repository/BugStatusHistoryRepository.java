
package com.bugtracker.repository;

import com.bugtracker.entity.BugStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BugStatusHistoryRepository
        extends JpaRepository<BugStatusHistory, Long> {

    List<BugStatusHistory> findByBugIdOrderByChangedAtAsc(Long bugId);
}
