import { Routes } from '@angular/router';
import { Index } from './author/index';
import { Create } from './author/create/create';

export const routes: Routes = [
  {path: 'authors', component: Index},
  {path: 'authors/create', component: Create},
];
