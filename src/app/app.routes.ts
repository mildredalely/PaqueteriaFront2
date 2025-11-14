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

  path: 'caja',
  loadComponent: () => import('./caja/caja.component').then(c => c.CajaComponent)
}
,
{
path: 'tab3',
  loadComponent: () => import('./tab3/tab3.page').then(c => c.Tab3Page)
},
  {
    path: '**',
    redirectTo: 'login'
  }


];
