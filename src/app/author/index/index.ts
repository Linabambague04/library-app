import { Component } from '@angular/core';
import { Author } from '../author';
import { AuthorService } from '../author-service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-index',
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index {
  authors: Author[] = [];

  constructor(private authorService: AuthorService){}

  ngOnInit(): void{
    this.authorService.getAuthors().subscribe((data: Author[])=>{
      this.authors = data;
    })
  }

}
