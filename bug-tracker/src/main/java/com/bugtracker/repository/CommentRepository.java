
package com.bugtracker.repository;

import com.bugtracker.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment> findByBugIdOrderByCreatedAtAsc(Long bugId);
}
