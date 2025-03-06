import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterLink, RouterLinkActive, CommonModule],
  standalone: true
})
export class SidebarComponent implements OnInit {
  links = [
    { label: 'Dashboard', path: '/dashboard/home' },
    { label: 'Schedule Pickup', path: '/dashboard/schedule' },
    { label: 'Report Issues', path: '/dashboard/report-issues' },
    { label: 'Pickup History', path: '/dashboard/history' },
    { label: 'Notifications', path: '/dashboard/notifications' },
    { label: 'Reports', path: '/dashboard/reports' }
  ];

  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
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