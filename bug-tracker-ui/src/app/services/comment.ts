
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BugComment {
  id?: number;
  bugId?: number;
  author: string;
  content: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/bugs';

  getComments(bugId: number): Observable<BugComment[]> {
    return this.http.get<BugComment[]>(
      `${this.apiUrl}/${bugId}/comments`
    );
  }

  addComment(
    bugId: number,
    comment: Pick<BugComment, 'author' | 'content'>
  ): Observable<BugComment> {
    return this.http.post<BugComment>(
      `${this.apiUrl}/${bugId}/comments`,
      comment
    );
  }
}
