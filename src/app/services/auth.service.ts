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
  
    // Assign role: admin if registering a new community; otherwise user
    user.role = user.isNewCommunity ? 'admin' : 'user';
  
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return 'success';
  }
  

  login(email: string, password: string): any {
    const user = this.users.find((u: any) => u.email === email && u.password === password);
    return user ? user : null;
  }
}
