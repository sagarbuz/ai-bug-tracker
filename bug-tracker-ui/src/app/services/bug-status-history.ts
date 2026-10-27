
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BugStatusHistoryEntry {
  id: number;
  bugId: number;
  previousStatus: string;
  newStatus: string;
  changedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BugStatusHistoryService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/bugs';

  getHistory(bugId: number): Observable<BugStatusHistoryEntry[]> {
    return this.http.get<BugStatusHistoryEntry[]>(
      `${this.apiUrl}/${bugId}/history`
    );
  }
}
