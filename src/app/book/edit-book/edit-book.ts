import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../book-service';
import { Book } from '../book';

@Component({
  selector: 'app-edit-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.css'
})
export class EditBook {
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

  constructor(private bookService: BookService, private router: Router, private route: ActivatedRoute){}
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

    this.bookService.updateBook(this.id, input).subscribe({
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
