import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: 'monitoramento',
    loadComponent: () =>
      import('./features/monitoramento/monitoramento').then((m) => m.Monitoramento)
  },
  {
    path: 'mfe1',
    loadChildren: () =>
      loadRemoteModule('mfe1', './Routes').then((m) => m.remoteRoutes ?? m.routes)
  }
];
