import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL = 'https://68edee12df2025af78019dcc.mockapi.io/app';

  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string, role: string) {
    return this.http
      .post<User>(this.apiURL, { name, email, password, role })
      .pipe(map(() => 'success'));
  }

  login(email: string, password: string): Observable<string | null> {
    return this.http.get<User[]>(this.apiURL).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            exp: Date.now() + 60 * 60 * 1000,
          };
          const token = btoa(JSON.stringify(tokenPayload));
          localStorage.setItem('jwtToken', token);
          console.log(token);
          return token;
        }
        return null;
      })
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      return Date.now() < payload.exp;
    } catch {
      this.logout();
      return false;
    }
  }

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token));
    } catch {
      this.logout();
      return null;
    }
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL);
  }

  updateUser(userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiURL}/${userId}`, data);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${userId}`);
  }
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}

//<User> is the response type
//and the code inside this brackets() is the body of the post request
//Pipe: It’s used to chain operators that can transform, filter, or handle the observable’s data before you subscribe.
