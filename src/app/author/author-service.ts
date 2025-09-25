import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from './author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiURL = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient){ }

  getAuthors(): Observable<Author[]>{
    return this.http.get<Author[]>(this.apiURL+"/authors")
  }

  createAuthor(data: Author): Observable<Author[]>{
    return this.http.post<Author[]>(this.apiURL+"/authors", data)
  }

}
