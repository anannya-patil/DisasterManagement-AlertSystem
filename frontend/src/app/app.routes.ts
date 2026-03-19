import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ResponderDashboardComponent } from './responder-dashboard/responder-dashboard.component';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { AlertsViewComponent } from './alerts-view/alerts-view.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { DisasterListComponent } from './disaster-list/disaster-list.component';
import { EditDisasterComponent } from './edit-disaster/edit-disaster.component';
import { AnalyticsDashboardComponent } from './analytics/analytics-dashboard/analytics-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' }
  },
  { 
    path: 'responder', 
    component: ResponderDashboardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'RESPONDER' }
  },
  { 
    path: 'citizen', 
    component: CitizenDashboardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'CITIZEN' }
  },
  { 
    path: 'profile', 
    component: ProfileFormComponent, 
    canActivate: [AuthGuard] 
  },
    { 
    path: 'disasters', 
    component: DisasterListComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
    { 
  path: 'edit-disaster/:id', 
  component: EditDisasterComponent, 
  canActivate: [AuthGuard] 
},
  { 
    path: 'alerts', 
    component: AlertsViewComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { 
    path: 'analytics', 
    component: AnalyticsDashboardComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' }
  },
  { path: '**', redirectTo: '/login' },
];