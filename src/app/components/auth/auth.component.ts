import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommunityService } from '../../services/community.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class AuthComponent implements OnInit {
  isLogin = true;
  username = '';
  email = '';
  password = '';
  community = '';
  newCommunityName = '';
  newCommunityAddress = '';
  errorMessage = '';
  communities: any[] = [];

  constructor(private authService: AuthService, private communityService: CommunityService, private router: Router) {}

  ngOnInit(): void {
    // Load communities on component initialization
    this.loadCommunities();
  }

  // Add this method to refresh communities data
  loadCommunities(): void {
    this.communities = this.communityService.getCommunities();
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    // Refresh communities when toggling to register mode
    if (!this.isLogin) {
      this.loadCommunities();
    }
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to the landing page route
}

  handleSubmit(): void {
    if (this.isLogin) {
      const user = this.authService.login(this.email, this.password);
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user session
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid credentials!';
      }
    } else {
      let isNewCommunity = false;
      if (this.community === 'other') {
        isNewCommunity = true;
        if (!this.communityService.isCommunityExists(this.newCommunityName)) {
          this.communityService.addCommunity({
            name: this.newCommunityName,
            address: this.newCommunityAddress
          });
          // Set the community to the newly added community name
          this.community = this.newCommunityName;
          // Refresh communities list after adding a new one
          this.loadCommunities();
        } else {
          this.errorMessage = 'Community already exists!';
          return;
        }
      }
  
      const response = this.authService.register({
        username: this.username,
        email: this.email,
        password: this.password,
        community: this.community,
        isNewCommunity: isNewCommunity // Use the explicit flag
      });
  
      if (response === 'success') {
        this.isLogin = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = response;
      }
    }
  }  
}