import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

   canActivate(): boolean {
    const user = this.auth.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = user.role;
    if(userRole!=='admin')
    {
      alert('Access denied. Only admins can view the admin dashboard.');
      this.router.navigate(['/user-dashboard']);
      return false;
    }
    return true;
  }
}
