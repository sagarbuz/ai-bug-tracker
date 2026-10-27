
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://localhost:8080/api/ai';

  constructor(private http: HttpClient) {}

  analyzeBug(description: string): Observable<{ analysis: string }> {
    return this.http.post<{ analysis: string }>(
      `${this.apiUrl}/analyze`,
      { description }
    );
  }
}
