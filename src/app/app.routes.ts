import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then((m) => m.HomePage),
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./pages/project').then((m) => m.ProjectPage),
  },
  // Anything else renders the project page's not-found branch, so a bad link still lands
  // on something that looks like the site rather than a blank page.
  {
    path: '**',
    loadComponent: () => import('./pages/project').then((m) => m.ProjectPage),
  },
];
