import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommunityService } from '../../services/community.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports:[FormsModule, CommonModule],
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

  constructor(private authService: AuthService, private communityService: CommunityService, private router: Router) {}

  ngOnInit(): void {
    this.communities = this.communityService.getCommunities();
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  handleSubmit(): void {
    if (this.isLogin) {
      if (this.authService.login(this.email, this.password)) {
        console.log("Success")
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid credentials!';
      }
    } else {
      if (this.community === 'other') {
        if (!this.communityService.isCommunityExists(this.newCommunityName)) {
          this.communityService.addCommunity({
            name: this.newCommunityName,
            address: this.newCommunityAddress,
            pickupTime: this.pickupTime,
          });
          this.community = this.newCommunityName;
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
