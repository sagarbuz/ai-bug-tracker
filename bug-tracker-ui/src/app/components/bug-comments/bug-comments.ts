
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  BugComment,
  CommentService
} from '../../services/comment';

@Component({
  selector: 'app-bug-comments',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './bug-comments.html',
  styleUrl: './bug-comments.scss'
})
export class BugComments implements OnChanges {
  @Input({ required: true }) bugId!: number;

  private commentService = inject(CommentService);

  comments: BugComment[] = [];
  author = 'Developer';
  content = '';
  loading = false;
  saving = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bugId'] && this.bugId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.commentService.getComments(this.bugId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load comments:', error);
        this.errorMessage = 'Unable to load comments.';
        this.loading = false;
      }
    });
  }

  addComment(): void {
    const author = this.author.trim();
    const content = this.content.trim();

    if (!author || !content || this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.commentService.addComment(
      this.bugId,
      { author, content }
    ).subscribe({
      next: (comment) => {
        this.comments = [...this.comments, comment];
        this.content = '';
        this.saving = false;
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
        this.errorMessage = 'Unable to add comment. Please try again.';
        this.saving = false;
      }
    });
  }
}
