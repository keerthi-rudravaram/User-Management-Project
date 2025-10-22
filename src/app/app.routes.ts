import { provideRouter, Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { AuthGuard } from './guard/auth-guard';
import { RoleGuard } from './guard/role-guard';
import { UserDashboard } from './user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard, RoleGuard] },
  { path: 'user-dashboard', component: UserDashboard, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];

export const appRouter = provideRouter(routes);
