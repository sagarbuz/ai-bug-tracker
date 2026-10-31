
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Bug {
  id?: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  assignee?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BugService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/bugs`;

  getAllBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl);
  }

  createBug(bug: Bug): Observable<Bug> {
    return this.http.post<Bug>(this.apiUrl, bug);
  }

  updateBug(id: number, bug: Bug): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/${id}`, bug);
  }

  deleteBug(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
