import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterLink, RouterLinkActive, CommonModule],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  links = [
    { label: 'Dashboard', path: '/dashboard/home' },
    { label: 'Schedule Pickup', path: '/dashboard/schedule' },
    { label: 'Report Issues', path: '/dashboard/report-issues' },
    { label: 'Pickup History', path: '/dashboard/history' },
    { label: 'Notifications', path: '/dashboard/notifications' },
    { label: 'Reports', path: '/dashboard/reports' },
  ];

  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  get userInitials(): string {
    if (!this.user || !this.user.username) {
      return '?'; // Return '?' or empty string if no user/username
    }

    const nameParts = this.user.username.trim().split(' ');
    if (nameParts.length === 1) {
      // Only one name/word, take the first letter
      return nameParts[0].charAt(0).toUpperCase();
    } else if (nameParts.length > 1) {
      // Take first letter of the first name and first letter of the last name
      const firstNameInitial = nameParts[0].charAt(0);
      const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstNameInitial + lastNameInitial).toUpperCase();
    }

    return '?'; // Fallback
  }

  loadUserData(): void {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }
}
