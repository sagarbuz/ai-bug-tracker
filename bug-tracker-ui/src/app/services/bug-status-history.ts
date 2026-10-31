
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  private apiUrl = `${environment.apiUrl}/api/bugs`;

  getHistory(bugId: number): Observable<BugStatusHistoryEntry[]> {
    return this.http.get<BugStatusHistoryEntry[]>(
      `${this.apiUrl}/${bugId}/history`
    );
  }
}
