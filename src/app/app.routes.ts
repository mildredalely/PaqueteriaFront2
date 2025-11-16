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
    path: '**',
    redirectTo: 'login'
  }

];
