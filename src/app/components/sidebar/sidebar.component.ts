import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports:[RouterLink,CommonModule]
})
export class SidebarComponent {
  links = [
    { label: 'Dashboard', path: '/dashboard/home' },
    { label: 'Schedule Pickup', path: '/dashboard/schedule' },
    { label: 'Report Issues', path: '/dashboard/report-issues' },
    { label: 'Pickup History', path: '/dashboard/history' },
    { label: 'Notifications', path: '/dashboard/notifications' },
    { label: 'Reports', path: '/dashboard/reports' }
  ];

  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
