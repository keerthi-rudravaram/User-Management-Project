import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, User } from '../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  loading = true;
  userEmail: string = '';
  userId: string = '';
  userRole: string = '';
  users: User[] = [];
  editUserId: string | null = null;
  editUserData: Partial<User> = {};

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

  startEdit(user: User) {
    this.editUserId = user.id;
    this.editUserData = { ...user };
  }

  cancelEdit() {
    this.editUserId = null;
    this.editUserData = {};
  }

  saveEdit(userId: string) {
    if (!this.editUserData.name || !this.editUserData.email || !this.editUserData.role) return;

    this.authService.updateUser(userId, this.editUserData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === userId);
        if (index !== -1) this.users[index] = updatedUser;
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating user', err),
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId);
        },
        error: (err) => console.error('Error deleting user', err),
      });
    }
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
