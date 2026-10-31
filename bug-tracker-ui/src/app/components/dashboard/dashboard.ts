
import { Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Bug, BugService } from '../../services/bug';
import { AiService } from '../../services/ai';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-dashboard',
  imports: [
    ConfirmDialog,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly title = signal('AI Bug Tracker');

  bugs: Bug[] = [];
  filteredBugs: Bug[] = [];

  // AI properties
  aiDescription = '';
  aiAnalysis = '';
  aiLoading = false;
  aiError = '';

  aiCategory = '';
  aiSeverity = '';
  aiSummary = '';
  aiDebuggingSteps: string[] = [];

  // Search and filters
  searchText = '';
  selectedStatus = '';
  selectedSeverity = '';
  selectedAssignee = '';

  // Loading and error states
  loading = true;
  errorMessage = '';

  // Create and edit form
  showCreateForm = false;
  saving = false;
  formError = '';
  editingBugId: number | null = null;

  bugForm;

  // Delete dialog
  showDeleteDialog = false;
  bugToDelete: Bug | null = null;

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

  // Load bugs
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
        this.errorMessage =
          'Unable to load bugs. Please check whether the backend is running.';
        this.loading = false;
      }
    });
  }

  // Open create form
  openCreateForm(): void {
    this.formError = '';
    this.editingBugId = null;

    this.bugForm.reset({
      title: '',
      description: '',
      severity: 'MEDIUM',
      status: 'OPEN',
      assignee: ''
    });

    this.clearAiResult();
    this.showCreateForm = true;
  }

  // Close create/edit form
  closeCreateForm(): void {
    this.showCreateForm = false;
    this.editingBugId = null;
    this.formError = '';

    this.bugForm.reset({
      title: '',
      description: '',
      severity: 'MEDIUM',
      status: 'OPEN',
      assignee: ''
    });

    this.clearAiResult();
  }

  // Create bug
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

  // Save either a new bug or an edited bug
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
        this.loadBugs();
      },
      error: (error) => {
        console.error('Failed to update bug:', error);
        this.saving = false;
        this.formError = 'Unable to update the bug. Please try again.';
      }
    });
  }

  // Edit bug
  editBug(bug: Bug): void {
    if (bug.id == null) {
      return;
    }

    this.editingBugId = bug.id;
    this.formError = '';

    this.clearAiResult();

    this.bugForm.patchValue({
      title: bug.title,
      description: bug.description,
      severity: bug.severity,
      status: bug.status,
      assignee: bug.assignee ?? ''
    });

    this.showCreateForm = true;
  }

  // Dashboard statistics
  get totalBugs(): number {
    return this.bugs.length;
  }

  get openBugs(): number {
    return this.bugs.filter(bug => bug.status === 'OPEN').length;
  }

  get inProgressBugs(): number {
    return this.bugs.filter(bug => bug.status === 'IN_PROGRESS').length;
  }

  get resolvedBugs(): number {
    return this.bugs.filter(bug => bug.status === 'RESOLVED').length;
  }

  get unassignedBugs(): number {
    return this.bugs.filter(
      bug => !bug.assignee || bug.assignee.trim() === ''
    ).length;
  }

  // Delete bug
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

  // Search and filters
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

  // Reset filters
  resetFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedSeverity = '';
    this.selectedAssignee = '';

    this.applyFilters();
  }

  // Analyze description from Create/Edit form
  analyzeFormDescription(): void {
    const description =
      this.bugForm.controls.description.value.trim();

    this.analyzeDescription(description);
  }

  // Analyze description from standalone AI Assistant
  analyzeBugWithAI(): void {
    const description = this.aiDescription.trim();

    this.analyzeDescription(description);
  }

  // Common AI analysis method
  private analyzeDescription(description: string): void {
    if (!description || this.aiLoading) {
      return;
    }

    this.aiLoading = true;
    this.aiAnalysis = '';
    this.aiError = '';

    this.aiCategory = '';
    this.aiSeverity = '';
    this.aiSummary = '';
    this.aiDebuggingSteps = [];

    this.aiService.analyzeBug(description).subscribe({
      next: (result) => {
        this.aiAnalysis = result.analysis;
        this.formatAiAnalysis(result.analysis);
        this.aiLoading = false;
      },
      error: (error) => {
        console.error('AI analysis failed:', error);

        this.aiError =
          'Unable to analyze the bug. Please check that the AI service is available and try again.';

        this.aiLoading = false;
      }
    });
  }

  // Reset AI result
  private clearAiResult(): void {
    this.aiAnalysis = '';
    this.aiError = '';
    this.aiCategory = '';
    this.aiSeverity = '';
    this.aiSummary = '';
    this.aiDebuggingSteps = [];
  }

  // Format and extract AI response
  formatAiAnalysis(analysis: string): void {
    this.aiCategory = '';
    this.aiSeverity = '';
    this.aiSummary = '';
    this.aiDebuggingSteps = [];

    // Remove Markdown formatting
    const cleanText = analysis
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\r/g, '')
      .trim();

    const lines = cleanText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    type Section =
      | 'category'
      | 'severity'
      | 'summary'
      | 'steps'
      | null;

    let currentSection: Section = null;

    const sections: Record<string, string[]> = {
      category: [],
      severity: [],
      summary: [],
      steps: []
    };

    // Identify section headings and collect their content
    for (const line of lines) {
      const headingLine = line.replace(/^[-*•]\s*/, '').trim();

      const headingMatch = headingLine.match(
        /^(?:\d+[.)]\s*)?(category|suggested severity|severity|a one-sentence summary|one-sentence summary|summary|suggested debugging steps|three debugging steps|debugging steps)\s*:?\s*(.*)$/i
      );

      if (headingMatch) {
        const heading = headingMatch[1].toLowerCase();
        const content = headingMatch[2].trim();

        if (heading === 'category') {
          currentSection = 'category';
        } else if (
          heading === 'suggested severity' ||
          heading === 'severity'
        ) {
          currentSection = 'severity';
        } else if (
          heading === 'a one-sentence summary' ||
          heading === 'one-sentence summary' ||
          heading === 'summary'
        ) {
          currentSection = 'summary';
        } else {
          currentSection = 'steps';
        }

        if (content) {
          sections[currentSection].push(content);
        }

        continue;
      }

      if (currentSection) {
        sections[currentSection].push(line);
      }
    }

    // Extract category
    this.aiCategory = this.cleanAiValue(
      sections['category'].join(' ')
    );

    // Extract only the severity label
    const severityText = sections['severity'].join(' ');

    const severityMatch = severityText.match(
      /\b(Critical|High|Medium|Low)\b/i
    );

    if (severityMatch) {
      this.aiSeverity =
        severityMatch[1].charAt(0).toUpperCase() +
        severityMatch[1].slice(1).toLowerCase();
    }

    // Extract summary
    this.aiSummary = this.cleanAiValue(
      sections['summary'].join(' ')
    );

    // Extract debugging steps
    this.aiDebuggingSteps = sections['steps']
      .map(step =>
        step
          .replace(/^\s*[-*•]\s*/, '')
          .replace(/^\s*\d+[.)]\s*/, '')
          .replace(/^\s*Step\s+\d+\s*:\s*/i, '')
          .trim()
      )
      .filter(Boolean);
  }

  // Clean AI text
  private cleanAiValue(value: string): string {
    return value
      .replace(/\*\*/g, '')
      .replace(/^\s*[-*•]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
