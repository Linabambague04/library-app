import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthorService } from '../author-service';
import { Author } from '../author';

@Component({
  selector: 'app-show',
  imports: [RouterModule],
  templateUrl: './show.html',
  styleUrl: './show.css'
})
export class Show {
   id = '';
  name = '';
  last_name = '';
  date_birth = '';
  nationality = '';
  biography = '';
  contact = '';

  constructor(private authorService:AuthorService, private route: ActivatedRoute){}

  ngOnInit(): void{
    this.id = this.route.snapshot.params['authorId'];
    console.log(this.id);
      this.authorService.findAuthor(this.id).subscribe((author: Author) =>{
        this.name = author.name;
        this.last_name = author.last_name;
        this.date_birth = author.date_birth;
        this.nationality = author.nationality;
        this.biography = author.biography;
        this.contact = author.contact;
      })
  }

}
