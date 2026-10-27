
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Bug, BugService } from '../../services/bug';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { RouterLink } from '@angular/router';
import { AiService } from '../../services/ai';
@Component({
  selector: 'app-dashboard',
  imports: [ConfirmDialog, ReactiveFormsModule, RouterLink,FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly title = signal('AI Bug Tracker');

  bugs: Bug[] = [];
  filteredBugs: Bug[] = [];

  aiDescription = '';
  aiAnalysis = '';
  aiLoading = false;
  aiError = '';
  aiCategory = '';
  aiSeverity = '';
  aiSummary = '';
  aiDebuggingSteps: string[] = [];

  searchText = '';
  selectedStatus = '';
  selectedSeverity = '';
  selectedAssignee = '';
  loading = true;
  errorMessage = '';

  showCreateForm = false;
  saving = false;
  formError = '';

  bugForm;

  constructor(
    private bugService: BugService,
    private formBuilder: FormBuilder,
    private aiService: AiService
  ) {
    this.bugForm = this.formBuilder.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['MEDIUM', Validators.required],
      status: ['OPEN', Validators.required],
      assignee: ['']
    });
  }

  ngOnInit(): void {
    this.loadBugs();
  }

  showDeleteDialog = false;
  bugToDelete: Bug | null = null;

  loadBugs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bugService.getAllBugs().subscribe({
      next: (data) => {
        this.bugs = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load bugs:', error);
        this.errorMessage = 'Unable to load bugs. Please check whether the backend is running.';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.formError = '';
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
  this.showCreateForm = false;
  this.editingBugId = null;
  this.bugForm.reset({
    title: '',
    description: '',
    severity: 'MEDIUM',
    status: 'OPEN'
  });
  }

  submitBug(): void {
    if (this.bugForm.invalid || this.saving) {
      this.bugForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.formError = '';

    this.bugService.createBug(this.bugForm.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.closeCreateForm();
        this.loadBugs();
      },
      error: (error) => {
        console.error('Failed to create bug:', error);
        this.saving = false;
        this.formError = 'Unable to save the bug. Please try again.';
      }
    });
  }


get totalBugs(): number {
  return this.bugs.length;
}

get openBugs(): number {
  return this.bugs.filter(
    bug => bug.status === 'OPEN'
  ).length;
}

get inProgressBugs(): number {
  return this.bugs.filter(
    bug => bug.status === 'IN_PROGRESS'
  ).length;
}

get resolvedBugs(): number {
  return this.bugs.filter(
    bug => bug.status === 'RESOLVED'
  ).length;
}

editingBugId: number | null = null;

editBug(bug: Bug): void {

  if (bug.id == null) {
    return;
  }

  this.editingBugId = bug.id;
  this.formError = '';

  this.bugForm.patchValue({
    title: bug.title,
    description: bug.description,
    severity: bug.severity,
    status: bug.status,
    assignee: bug.assignee ?? ''
  });

  this.showCreateForm = true;
}

saveBug(): void {
  if (this.bugForm.invalid || this.saving) {
    this.bugForm.markAllAsTouched();
    return;
  }

  if (this.editingBugId === null) {
    this.submitBug();
    return;
  }

  this.saving = true;
  this.formError = '';

  const id = this.editingBugId;
  const updatedBug = this.bugForm.getRawValue();

  this.bugService.updateBug(id, updatedBug).subscribe({
    next: () => {
      this.saving = false;
      this.closeCreateForm();
      this.editingBugId = null;
      this.loadBugs();
    },
    error: (error) => {
      console.error('Failed to update bug:', error);
      this.saving = false;
      this.formError = 'Unable to update the bug. Please try again.';
    }
  });
  }


openDeleteDialog(bug: Bug): void {
  if (bug.id == null) {
    return;
  }

  this.bugToDelete = bug;
  this.showDeleteDialog = true;
}

closeDeleteDialog(): void {
  this.showDeleteDialog = false;
  this.bugToDelete = null;
}

confirmDeleteBug(): void {
  if (this.bugToDelete?.id == null) {
    return;
  }

  const id = this.bugToDelete.id;

  this.bugService.deleteBug(id).subscribe({
    next: () => {
      this.closeDeleteDialog();
      this.loadBugs();
    },
    error: (error) => {
      console.error('Failed to delete bug:', error);
      this.closeDeleteDialog();
      this.errorMessage = 'Unable to delete the bug. Please try again.';
    }
  });
  }

  applyFilters(): void {
  const search = this.searchText.trim().toLowerCase();

  this.filteredBugs = this.bugs.filter(bug => {
    const matchesSearch =
      !search ||
      String(bug.id ?? '').includes(search) ||
      bug.title.toLowerCase().includes(search) ||
      bug.description.toLowerCase().includes(search);

    const matchesStatus =
      !this.selectedStatus ||
      bug.status === this.selectedStatus;

    const matchesSeverity =
      !this.selectedSeverity ||
      bug.severity === this.selectedSeverity;

    const matchesAssignee =
      !this.selectedAssignee ||
      (bug.assignee ?? '') === this.selectedAssignee;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSeverity &&
      matchesAssignee
    );
  });
}

  resetFilters(): void {
  this.searchText = '';
  this.selectedStatus = '';
  this.selectedSeverity = '';
  this.selectedAssignee = '';

  this.applyFilters();
}

  get unassignedBugs(): number {
  return this.bugs.filter(
    bug => !bug.assignee || bug.assignee.trim() === ''
  ).length;
}

analyzeBugWithAI(): void {
  const description = this.aiDescription.trim();

  if (!description || this.aiLoading) {
    return;
  }

  this.aiLoading = true;
  this.aiAnalysis = '';
  this.aiError = '';

  this.aiService.analyzeBug(description).subscribe({
    next: (result) => {
      this.aiAnalysis = result.analysis;
      this.formatAiAnalysis(result.analysis);
      this.aiLoading = false;
    },
    error: (error) => {
      console.error('AI analysis failed:', error);
      this.aiError = 'Unable to analyze the bug. Please check that the backend and Ollama are running.';
      this.aiLoading = false;
    }
  });
  }


formatAiAnalysis(analysis: string): void {
  this.aiCategory = '';
  this.aiSeverity = '';
  this.aiSummary = '';
  this.aiDebuggingSteps = [];

  const categoryMatch = analysis.match(
    /Category:\s*([\s\S]*?)(?=\s*\d*[.)]?\s*Suggested severity:|$)/i
  );

  const severityMatch = analysis.match(
    /Suggested severity:\s*([\s\S]*?)(?=\s*\d*[.)]?\s*(?:A one-sentence summary|One-sentence summary):|$)/i
  );

  const summaryMatch = analysis.match(
    /(?:A one-sentence summary|One-sentence summary):\s*([\s\S]*?)(?=\s*\d*[.)]?\s*Three debugging steps:|$)/i
  );

  const stepsMatch = analysis.match(
    /Three debugging steps:\s*([\s\S]*)/i
  );

  this.aiCategory = categoryMatch?.[1]
    ?.replace(/\s+/g, ' ')
    .replace(/\s*\d+[.)]\s*$/, '')
    .trim() ?? '';

  this.aiSeverity = severityMatch?.[1]
    ?.replace(/\s+/g, ' ')
    .replace(/\s*\d+[.)]\s*$/, '')
    .trim() ?? '';

  this.aiSummary = summaryMatch?.[1]
    ?.replace(/\s+/g, ' ')
    .trim() ?? '';

  if (stepsMatch?.[1]) {
    this.aiDebuggingSteps = stepsMatch[1]
      .split(/(?:^|\s)\d+[.)]\s*/)
      .map(step => step.trim())
      .filter(Boolean)
      .map(step => step.replace(/\s+/g, ' '));
  }
}


}

