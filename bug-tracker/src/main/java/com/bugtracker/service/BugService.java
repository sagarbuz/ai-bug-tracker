
package com.bugtracker.service;

import com.bugtracker.entity.Bug;
import com.bugtracker.entity.BugStatusHistory;
import com.bugtracker.repository.BugRepository;
import com.bugtracker.repository.BugStatusHistoryRepository;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugService {

    private final BugRepository bugRepository;

    public BugService(
        BugRepository bugRepository,
        BugStatusHistoryRepository historyRepository) {
    this.bugRepository = bugRepository;
    this.historyRepository = historyRepository;
}

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    
@Transactional
public Bug updateBug(Long id, Bug updatedBug) {
    Bug existingBug = bugRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Bug not found with id: " + id));

    String oldStatus = existingBug.getStatus();
    String newStatus = updatedBug.getStatus();

    // Record history only when the status changes.
    if (newStatus != null
            && !newStatus.equals(oldStatus)) {

        BugStatusHistory history = new BugStatusHistory();
        history.setBugId(id);
        history.setPreviousStatus(
                oldStatus == null ? "NEW" : oldStatus);
        history.setNewStatus(newStatus);

        historyRepository.save(history);
    }

    existingBug.setTitle(updatedBug.getTitle());
    existingBug.setDescription(updatedBug.getDescription());
    existingBug.setSeverity(updatedBug.getSeverity());
    existingBug.setStatus(updatedBug.getStatus());
    existingBug.setAssignee(updatedBug.getAssignee());

    return bugRepository.save(existingBug);
}


    public void deleteBug(Long id) {
        Bug existingBug = bugRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Bug not found with id: " + id));

        bugRepository.delete(existingBug);
    }

    

    private final BugStatusHistoryRepository historyRepository;
}
