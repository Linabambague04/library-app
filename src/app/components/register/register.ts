import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  backendErrors: any = {}; 
  roles = ['author', 'editorial', 'admin'];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],

      last_name: [''],
      date_birth: [''],
      nationality: [''],
      biography: [''],
      contact: [''],

      company_name: [''],
      website: [''],
      phone: [''],
      address: [''],
      description: ['']
    });
  }

  submit() {
    if (this.registerForm.invalid) return;

    this.backendErrors = {};

    const data = this.registerForm.value;

    this.authService.register(data).subscribe({
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
