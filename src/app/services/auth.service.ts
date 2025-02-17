import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = JSON.parse(localStorage.getItem('users') || '[]');

  register(user: any): string {
    // Check if email or username already exists
    if (this.users.some((u: any) => u.email === user.email || u.username === user.username)) {
      return 'Username or Email already exists!';
    }

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return 'success';
  }

  login(email: string, password: string): boolean {
    return this.users.some((u: any) => u.email === email && u.password === password);
  }
}
