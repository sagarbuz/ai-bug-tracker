
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Bug, BugService } from '../../services/bug';
import { BugComments } from '../bug-comments/bug-comments';
import { BugStatusHistory } from '../bug-status-history/bug-status-history';

@Component({
  selector: 'app-bug-details',
  standalone: true,
  imports: [CommonModule, RouterLink, BugComments,BugStatusHistory],
  templateUrl: './bug-details.html',
  styleUrl: './bug-details.scss'
})
export class BugDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private bugService = inject(BugService);

  bug: Bug | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid bug ID.';
      this.loading = false;
      return;
    }

    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        this.bug = bugs.find(item => item.id === id) ?? null;
        this.loading = false;

        if (!this.bug) {
          this.errorMessage = 'Bug not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load bug details.';
        this.loading = false;
      }
    });
  }
}
