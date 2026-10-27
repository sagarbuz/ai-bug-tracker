
import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { BugDetails } from './components/bug-details/bug-details';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'bugs/:id',
    component: BugDetails
  },
  {
    path: '**',
    redirectTo: ''
  }
];
