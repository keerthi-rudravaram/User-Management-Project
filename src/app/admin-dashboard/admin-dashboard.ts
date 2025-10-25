import { Component } from '@angular/core';
import { Auth, User } from '../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
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
    if (!this.editUserData.name || !this.editUserData.email || !this.editUserData.role) {
      alert('All fields (Name, Email, Role) are required.');
      return;
    }

    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailPattern.test(this.editUserData.email)) {
      alert('Invalid email format.');
      return;
    }

    this.authService.updateUser(userId, this.editUserData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === userId);
        if (index !== -1) this.users[index] = updatedUser;
        this.cancelEdit();
        alert('User updated successfully!');
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
