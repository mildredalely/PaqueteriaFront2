import { Routes } from '@angular/router';
import { RegistrarPage } from './pages/registrar/registrar.page';
import { Tab1Page } from './tab1/tab1.page';
import { LoginPage } from './pages/login/login.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'nuevo',
    component: RegistrarPage
  },
  {
    path: 'envio-mx',
    component: Tab1Page
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
