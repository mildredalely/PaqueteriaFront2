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
  path: 'historial',
  loadComponent: () => import('./pages/historial/historial.page').then(m => m.HistorialPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  }


];
