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
    if (user && user.role === 'admin') {
      return true;
    }
    alert('Access denied! Admins only.');
    this.router.navigate(['/user-dashboard']);
    return false;
  }
}
