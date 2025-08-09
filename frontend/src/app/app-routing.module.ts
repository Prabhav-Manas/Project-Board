import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './project/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { AuthGuard } from './auth/auth.gurad';
import { LogInGuard } from './auth/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'app-dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project-details',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LogInGuard],
})
export class AppRoutingModule {}
