import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.auth.loggedIn$.subscribe(() => {
      this.updateAuthState(); //this is being called when login state changes
    });
    this.updateAuthState(); //initial check on component load
  }

  updateAuthState() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userRole = this.auth.getUserRole();
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
