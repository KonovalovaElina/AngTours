import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ToursComponent } from './pages/tours/tours.component';

export const routes: Routes = [

  {
    path: 'auth', 
    loadComponent: () => import('./pages/auth/auth.component').then(c => c.AuthComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ToursComponent
      }
    ]
  },
  
];
