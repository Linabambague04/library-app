import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiURL = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient){ }

  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiURL+"/books")
  }

  createBook(data: Book): Observable<Book> {
    return this.http.post<Book>(this.apiURL + "/books", data);
  }

  findBook(id: string): Observable<Book>{
    return this.http.get<Book>(this.apiURL+"/books/" + id)
  }

  updateBook(id: string, data: Book): Observable<Book>{
      return this.http.put<Book>(this.apiURL+"/books/"+ id, data)
  }

  deleteBook(id: number): Observable<any>{
    return this.http.delete<any>(this.apiURL+"/books/" + id)
  }

}
