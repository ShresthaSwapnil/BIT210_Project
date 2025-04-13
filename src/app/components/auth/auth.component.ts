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
  isLogin = true;
  username = '';
  email = '';
  password = '';
  community = '';
  newCommunityName = '';
  newCommunityAddress = '';
  pickupTime = '';
  errorMessage = '';
  communities: any[] = [];

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
    if (!this.isLogin) this.loadCommunities();
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to landing page
  }

  handleSubmit(): void {
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
