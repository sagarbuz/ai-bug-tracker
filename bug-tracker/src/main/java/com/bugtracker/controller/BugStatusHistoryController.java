
package com.bugtracker.controller;

import com.bugtracker.entity.BugStatusHistory;
import com.bugtracker.service.BugStatusHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs/{bugId}/history")
@CrossOrigin(origins = "http://localhost:4200")
public class BugStatusHistoryController {

    private final BugStatusHistoryService historyService;

    public BugStatusHistoryController(
            BugStatusHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<BugStatusHistory> getHistory(
            @PathVariable Long bugId) {
        return historyService.getHistory(bugId);
    }
}
