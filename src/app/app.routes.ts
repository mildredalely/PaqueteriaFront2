import { Routes } from '@angular/router';
import { RegistrarPage } from './pages/registrar/registrar.page';
import { Tab1Page } from './tab1/tab1.page';
import { LoginPage } from './pages/login/login.page';
import { CajaComponent } from './caja/caja.component';
import { Tab3Page } from './tab3/tab3.page';

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
    component: CajaComponent
  },
  {
    path: 'reporte',
    component: Tab3Page
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
