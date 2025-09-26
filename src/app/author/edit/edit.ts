import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService } from '../author-service';
import { Author } from '../author';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit {
  id = '';
  name = '';
  last_name = '';
  date_birth = '';
  nationality = '';
  biography = '';
  contact = '';
  error = '';

  constructor(private authorService:AuthorService, private router: Router, private route: ActivatedRoute){}

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

  submit() {
    if(!this.name || !this.last_name || !this.date_birth || !this.nationality || !this.biography || !this.contact ){
      this.error = 'All data is required';
      return;
    }

    const input = {
      id: 1,
      name: this.name,
      last_name: this.last_name,
      date_birth: this.date_birth,
      nationality: this.nationality,
      biography: this.biography,
      contact: this.contact,
    };

    this.authorService.updateAuthor(this.id, input).subscribe();

    alert("Author created");
    this.router.navigate(['authors']);
  }

}
