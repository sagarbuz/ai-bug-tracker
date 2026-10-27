
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BugStatusHistoryEntry, BugStatusHistoryService } from '../../services/bug-status-history';

@Component({
  selector: 'app-bug-status-history',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './bug-status-history.html',
  styleUrl: './bug-status-history.scss'
})
export class BugStatusHistory implements OnChanges {
  @Input({ required: true }) bugId!: number;

  private historyService = inject(BugStatusHistoryService);

  history: BugStatusHistoryEntry[] = [];
  loading = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bugId'] && this.bugId) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.historyService.getHistory(this.bugId).subscribe({
      next: (data) => {
        this.history = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load status history:', error);
        this.errorMessage = 'Unable to load status history.';
        this.loading = false;
      }
    });
  }
}
