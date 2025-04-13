import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  imports:[CommonModule,FormsModule]
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  announcementText = '';
  isAdmin = false; // Change to true if admin logic is implemented later

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.isAdmin = loggedInUser.role === 'admin';
  }
  
  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: () => console.error('Failed to fetch notifications'),
    });
  }
  
  broadcastAnnouncement(): void {
    if (this.announcementText.trim() !== '') {
      const notification = {
        message: this.announcementText,
        type: 'announcement'
      };
  
      this.notificationService.addNotification(notification).subscribe({
        next: () => {
          this.fetchNotifications();
          this.announcementText = '';
        },
        error: () => console.error('Failed to broadcast announcement')
      });
    }
  }
  
  // Admin Delete Feature
  deleteNotification(id: string): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(id).subscribe({
        next: () => this.fetchNotifications(),
        error: () => console.error('Failed to delete notification')
      });
    }
  }
  
}
