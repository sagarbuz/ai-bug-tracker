
package com.bugtracker.controller;

import com.bugtracker.entity.Comment;
import com.bugtracker.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs/{bugId}/comments")
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://ai-bug-tracker-ui.vercel.app"
})
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getComments(
            @PathVariable Long bugId) {
        return commentService.getComments(bugId);
    }

    @PostMapping
    public Comment addComment(
            @PathVariable Long bugId,
            @RequestBody Comment comment) {
        return commentService.addComment(bugId, comment);
    }
}
