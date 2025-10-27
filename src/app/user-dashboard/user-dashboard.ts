import { Component } from '@angular/core';
import { Auth, User } from '../services/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
  loading = true;
  userEmail: string = '';
  userId: string = '';
  userRole: string = '';
  users: User[] = [];

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userEmail = user.email;
    this.userId = user.id;
    this.userRole = user.role;
    this.loading = false;

    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  getCurrentUser()
  {
    return this.authService.getCurrentUser();
  }

  goToDetails(userId: string) {
    this.router.navigate(['/user-details', userId]);
  }
}
