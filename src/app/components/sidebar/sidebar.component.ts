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
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Schedule Pickup', path: '/schedule' },
    { label: 'Report Issues', path: '/report' },
    { label: 'Pickup History', path: '/history' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Reports', path: '/reports' }
  ];

  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
