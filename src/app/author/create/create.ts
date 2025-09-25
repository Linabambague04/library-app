import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthorService } from '../author-service';

@Component({
  selector: 'app-create',
  imports: [RouterLink, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class Create {
  id = '';
  name = '';
  last_name = '';
  date_birth = '';
  nationality = '';
  biography = '';
  contact = '';
  error = '';

  constructor(private authorService:AuthorService, private router: Router){}

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

    this.authorService.createAuthor(input).subscribe();

    alert("Author created");
    this.router.navigate(['authors']);
  }
}

