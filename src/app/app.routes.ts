import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'envio-mx',
    loadComponent: () => import('./tab1/tab1.page').then( m => m.Tab1Page)
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];
