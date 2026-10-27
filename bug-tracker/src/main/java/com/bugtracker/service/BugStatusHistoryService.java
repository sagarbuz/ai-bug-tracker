
package com.bugtracker.service;

import com.bugtracker.entity.Bug;
import com.bugtracker.entity.BugStatusHistory;
import com.bugtracker.repository.BugRepository;
import com.bugtracker.repository.BugStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugStatusHistoryService {

    private final BugRepository bugRepository;
    private final BugStatusHistoryRepository historyRepository;

    public BugStatusHistoryService(
            BugRepository bugRepository,
            BugStatusHistoryRepository historyRepository) {
        this.bugRepository = bugRepository;
        this.historyRepository = historyRepository;
    }

    public List<BugStatusHistory> getHistory(Long bugId) {
        if (!bugRepository.existsById(bugId)) {
            throw new RuntimeException("Bug not found: " + bugId);
        }

        return historyRepository.findByBugIdOrderByChangedAtAsc(bugId);
    }
}
