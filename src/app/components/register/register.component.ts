import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent { 
  registerForm: FormGroup;
  backendErrors: any = {};
  roles = ['author', 'editorial', 'reader', 'admin'];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],

      // autor
      last_name: [''],
      date_birth: [''],
      nationality: [''],
      biography: [''],
      contact: [''],

      // editorial
      company_name: [''],
      website: [''],
      phone: [''],
      address: [''],
      description: [''],

      // reader
      nickname: [''],
      favorite_genre: [''],
    });
  }

  submit() {
    if (this.registerForm.invalid) return;

    this.backendErrors = {};

    const data = this.registerForm.value;

    const role = data.role;
    let payload: any = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    if (role === 'author') {
      payload = { ...payload,
        last_name: data.last_name,
        date_birth: data.date_birth,
        nationality: data.nationality,
        biography: data.biography,
        contact: data.contact
      };
    }

    if (role === 'editorial') {
      payload = { ...payload,
        company_name: data.company_name,
        website: data.website,
        phone: data.phone,
        address: data.address,
        description: data.description
      };
    }

    if (role === 'reader') {
      payload = { ...payload,
        nickname: data.nickname,
        date_birth: data.date_birth,
        favorite_genre: data.favorite_genre
      };
    }

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        alert('Registro exitoso!');
        this.registerForm.reset();
      },
      error: (err) => {
        console.log('Errores de validación:', err.error);
        if (err.status === 422) {
          this.backendErrors = err.error.errors || {};
        } else {
          alert(err.error.message || 'Ocurrió un error');
        }
      }
    });
  }

}
