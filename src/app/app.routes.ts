import { Routes } from '@angular/router';
import { Index } from './author/index';
import { Create } from './author/create/create';
import { Edit } from './author/edit/edit';
import { Show } from './author/show/show';

export const routes: Routes = [
  {path: 'authors', component: Index},
  {path: 'authors/create', component: Create},
  {path: 'authors/:authorId/edit', component: Edit},
  {path: 'authors/:authorId', component: Show},

];
