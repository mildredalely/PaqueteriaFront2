import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
  path: 'caja',
  loadComponent: () => import('./caja/caja.component').then(c => c.CajaComponent)
}

];
