import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EditorialItem { id: number; user?: { name: string } | null; company_name?: string | null; }

@Injectable({ providedIn: 'root' })
export class EditorialsService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}

  list(): Observable<{ data: EditorialItem[] } | EditorialItem[]> {
    return this.http.get<{ data: EditorialItem[] } | EditorialItem[]>(`${this.apiUrl}/editorials`);
  }
}
