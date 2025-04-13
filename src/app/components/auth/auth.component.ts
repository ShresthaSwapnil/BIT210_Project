import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommunityService } from '../../services/community.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class AuthComponent implements OnInit {
  isLogin = false;
  username = '';
  email = '';
  password = '';
  community = '';
  newCommunityName = '';
  newCommunityAddress = '';
  pickupTime = '';
  errorMessage = '';
  communities: any[] = [];
  passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  passwordError = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.communityService.getCommunities().subscribe({
      next: (data) => {
        this.communities = data;
      },
      error: () => {
        console.error('Failed to load communities');
      },
    });
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.passwordError = '';
    if (!this.isLogin) this.loadCommunities();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to landing page
  }

  validatePassword(): boolean {
    if (!this.password) {
      this.passwordError = 'Password is required';
      return false;
    }

    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      return false;
    }

    if (!this.passwordPattern.test(this.password)) {
      this.passwordError =
        'Password must contain at least 1 number and 1 special character';
      return false;
    }

    this.passwordError = '';
    return true;
  }

  handleSubmit(): void {
    if (!this.isLogin && !this.validatePassword()) {
      return;
    }

    if (this.isLogin) {
      this.authService.loginAPI(this.email, this.password).subscribe({
        next: (response: any) => {
          localStorage.setItem('loggedInUser', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Invalid credentials!';
        },
      });
    } else {
      let isNewCommunity = false;

      const registerAndNavigate = () => {
        const newUser = {
          username: this.username,
          email: this.email,
          password: this.password,
          community: this.community,
          role: isNewCommunity ? 'admin' : 'user',
        };

        this.authService.registerAPI(newUser).subscribe({
          next: () => {
            this.isLogin = true;
            this.errorMessage = '';
          },
          error: (err) => {
            console.log(err);
            this.errorMessage = 'Registration failed or user already exists!';
          },
        });
      };

      if (this.community === 'other') {
        isNewCommunity = true;
        this.communityService
          .addCommunity({
            name: this.newCommunityName,
            address: this.newCommunityAddress,
            pickupTime: this.pickupTime,
          })
          .subscribe({
            next: (res) => {
              this.community = this.newCommunityName; // Set new community
              this.loadCommunities(); // Refresh the list
              registerAndNavigate();
            },
            error: () => {
              this.errorMessage = 'Failed to add community';
            },
          });
      } else {
        registerAndNavigate();
      }
    }
  }
}
