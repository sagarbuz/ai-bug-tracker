
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = `${environment.apiUrl}/api/ai`;

  constructor(private http: HttpClient) {

  console.log('Production mode:', environment.production);
  console.log('API URL:', this.apiUrl);
  }

  analyzeBug(description: string): Observable<{ analysis: string }> {
    return this.http.post<{ analysis: string }>(
      `${this.apiUrl}/analyze`,
      { description }
    );
  }
}
