import { Component } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book-service';
import { RouterLink } from '@angular/router';
import { Author } from '../../author/author';

@Component({
  selector: 'app-index-book',
  imports: [RouterLink],
  templateUrl: './index-book.html',
  styleUrl: './index-book.css'
})
export class IndexBook {
  books: Book[] = [];

  constructor(private bookService: BookService){ }

  ngOnInit(): void{
    this.loadBooks();
  }

  deleteBook(id: number) {
    if(confirm("Are you sure to remove this book?")){
      this.bookService.deleteBook(id).subscribe(()=>{
         this.loadBooks();
      });
    }
  }

  loadBooks(){
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }
}
