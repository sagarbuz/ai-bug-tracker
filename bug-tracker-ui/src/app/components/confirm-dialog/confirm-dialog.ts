
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  @Input() title = 'Confirm deletion';

  @Input() message =
    'Are you sure you want to delete this bug? This action cannot be undone.';

  @Output() confirmed = new EventEmitter<void>();

  @Output() cancelled = new EventEmitter<void>();

  confirmDelete(): void {
    this.confirmed.emit();
  }

  cancelDelete(): void {
    this.cancelled.emit();
  }
}
