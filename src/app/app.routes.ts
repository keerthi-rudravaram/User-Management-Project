import { provideRouter, Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { AuthGuard } from './guard/auth-guard';
import { RoleGuard } from './guard/role-guard';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { Home } from './home/home';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'user-dashboard',
    component: UserDashboard,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: Home },
  { path: '**', redirectTo: 'home' },
];

export const appRouter = provideRouter(routes);
