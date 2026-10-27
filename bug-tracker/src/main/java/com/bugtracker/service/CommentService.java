
package com.bugtracker.service;

import com.bugtracker.entity.Bug;
import com.bugtracker.entity.Comment;
import com.bugtracker.repository.BugRepository;
import com.bugtracker.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final BugRepository bugRepository;

    public CommentService(
            CommentRepository commentRepository,
            BugRepository bugRepository) {
        this.commentRepository = commentRepository;
        this.bugRepository = bugRepository;
    }

    public List<Comment> getComments(Long bugId) {
        if (!bugRepository.existsById(bugId)) {
            throw new RuntimeException("Bug not found: " + bugId);
        }

        return commentRepository
                .findByBugIdOrderByCreatedAtAsc(bugId);
    }

    public Comment addComment(Long bugId, Comment comment) {
        if (!bugRepository.existsById(bugId)) {
            throw new RuntimeException("Bug not found: " + bugId);
        }

        if (comment.getContent() == null
                || comment.getContent().isBlank()) {
            throw new IllegalArgumentException(
                    "Comment cannot be empty");
        }

        comment.setId(null);
        comment.setBugId(bugId);

        return commentRepository.save(comment);
    }
}
