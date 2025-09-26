import { Component } from '@angular/core';
import { BookService } from '../book-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Author } from '../../author/author';
import { Book } from '../book';

@Component({
  selector: 'app-show-book',
  imports: [RouterLink],
  templateUrl: './show-book.html',
  styleUrl: './show-book.css'
})
export class ShowBook {
  id = '';
  title = '';
  ISBN = '';
  image = '';
  subtitle = '';
  publication_date = '';
  number_pages = '';
  genre = '';
  editorial = '';
  id_author = '';
  language = '';
  synopsis = '';

  constructor(private bookService:BookService, private route: ActivatedRoute){}

  ngOnInit(): void{
    this.id = this.route.snapshot.params['bookId'];
    console.log(this.id);
      this.bookService.findBook(this.id).subscribe((book: Book) =>{
        this.ISBN = book.ISBN;
        this.title = book.title;
        this.image = book.image || '';
        this.subtitle = book.subtitle || '';
        this.publication_date = book.publication_date || '';
        this.number_pages = book.number_pages?.toString() || '' ;
        this.genre = book.genre || '';
        this.editorial = book.editorial || '';
        this.id_author = book.id_author?.toString() || '';
        this.language = book.language || '';
        this.synopsis = book.synopsis || '';
      })
  }

}
