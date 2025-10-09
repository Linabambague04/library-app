import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, PaginatedResponse } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private storageBase = 'http://127.0.0.1:8000/storage/';

  constructor(private http: HttpClient) {}

  list(params?: { page?: number; title?: string; genre?: string }): Observable<PaginatedResponse<Book>> {
    let hp = new HttpParams();
    if (params?.page) hp = hp.set('page', params.page);
    if (params?.title) hp = hp.set('title', params.title);
    if (params?.genre) hp = hp.set('genre', params.genre);
    return this.http.get<PaginatedResponse<Book>>(`${this.apiUrl}/books`, { params: hp });
  }

  get(id: number): Observable<{ success: boolean; message: string; data: Book }> {
    return this.http.get<{ success: boolean; message: string; data: Book }>(`${this.apiUrl}/books/${id}`);
  }

  create(form: FormData): Observable<{ success: boolean; message: string; data: Book }> {
    return this.http.post<{ success: boolean; message: string; data: Book }>(`${this.apiUrl}/books`, form);
  }

  update(id: number, form: FormData): Observable<{ success: boolean; message: string; data: Book }> {
    form.append('_method', 'PUT');
    return this.http.post<{ success: boolean; message: string; data: Book }>(`${this.apiUrl}/books/${id}`, form);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  toStorageUrl(path?: string | null): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return this.storageBase + path.replace(/^\/+/, '');
  }

  getFileUrl(id: number): string {
    return `${this.apiUrl}/books/${id}/file`;
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/books/${id}/read`, {});
  }
}
