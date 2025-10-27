import { Component, OnInit } from '@angular/core';
import { Auth, User } from '../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  user: User | null = null;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private authService: Auth) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.isLoading = false;
        },
      });
    }
  }

  goBack(): void {
    if (this.authService.getUserRole() === 'admin') this.router.navigate(['/admin-dashboard']);
    else this.router.navigate(['/user-dashboard']);
  }
}
