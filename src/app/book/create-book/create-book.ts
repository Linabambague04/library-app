import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../book-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-book',
  imports: [RouterLink, FormsModule],
  templateUrl: './create-book.html',
  styleUrl: './create-book.css'
})
export class CreateBook {
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
  error = '';

  constructor(private bookService: BookService, private router: Router){}

  submit() {
    if(!this.ISBN || !this.title || !this.id_author){
      this.error = 'ISBN, title and author is required';
      return;
    }

    const input ={
      id: 1,
      title: this.title,
      ISBN: this.ISBN,
      image: this.image,
      subtitle: this.subtitle,
      publication_date: this.publication_date,
      number_pages: Number(this.number_pages),
      genre: this.genre,
      editorial: this.editorial,
      id_author: Number(this.id_author),
      language: this.language,
      synopsis: this.synopsis,
    };

    this.bookService.createBook(input).subscribe({
      next: () => {
        alert("Book created");
        this.router.navigate(['books']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error creating book';
      }
    });

  }

}
