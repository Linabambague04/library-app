import { Routes } from '@angular/router';
import { Index } from './author/index';
import { Create } from './author/create/create';
import { Edit } from './author/edit/edit';
import { Show } from './author/show/show';
import { IndexBook } from './book/index-book/index-book';
import { CreateBook } from './book/create-book/create-book';
import { ShowBook } from './book/show-book/show-book';
import { EditBook } from './book/edit-book/edit-book';

export const routes: Routes = [

  //Author
  {path: 'authors', component: Index},
  {path: 'authors/create', component: Create},
  {path: 'authors/:authorId/edit', component: Edit},
  {path: 'authors/:authorId', component: Show},

  //Book
  {path: 'books', component: IndexBook},
  {path: 'books/create', component: CreateBook},
  {path: 'books/:bookId/edit', component: EditBook},
  {path: 'books/:bookId', component: ShowBook},
];
