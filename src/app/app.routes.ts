import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BooksListComponent } from './components/books/books-list.component';
import { BookDetailComponent } from './components/books/book-detail.component';
import { BookFormComponent } from './components/books/book-form.component';
import { authGuard } from './guards/auth.guard';
import { authorGuard } from './guards/author.guard';
// Using loadComponent to avoid transient TS resolution issues in IDE


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'books', component: BooksListComponent, canActivate: [authGuard] },
  { path: 'books/:id', component: BookDetailComponent, canActivate: [authGuard] },
  { path: 'author/books/new', component: BookFormComponent, canActivate: [authGuard, authorGuard] },
  { path: 'author/books/:id/edit', canActivate: [authGuard, authorGuard], loadComponent: () => import('./components/books/book-edit.component').then(m => m.BookEditComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
  { path: '**', redirectTo: '/login' }
];
