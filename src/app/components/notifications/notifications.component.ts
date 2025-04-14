import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  imports: [CommonModule, FormsModule],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  announcementText = '';
  isAdmin = false;
  loggedInUser: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    this.isAdmin = this.loggedInUser.role === 'admin';
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => (this.notifications = data),
      error: () => console.error('Failed to fetch notifications'),
    });
  }

  broadcastAnnouncement(): void {
    if (this.announcementText.trim() !== '') {
      const notification = {
        message: this.announcementText,
        type: 'announcement',
        community: this.loggedInUser.community,
        createdBy: this.loggedInUser._id,
      };

      this.notificationService.addNotification(notification).subscribe({
        next: () => {
          this.fetchNotifications();
          this.announcementText = '';
        },
        error: () => console.error('Failed to broadcast announcement'),
      });
    }
  }

  deleteNotification(id: string, community: string): void {
    if (this.loggedInUser.community !== community) {
      alert('You can only delete notifications from your own community.');
      return;
    }

    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(id).subscribe({
        next: () => this.fetchNotifications(),
        error: () => console.error('Failed to delete notification'),
      });
    }
  }

  canDelete(notification: any): boolean {
    return (
      this.isAdmin && notification.community === this.loggedInUser.community
    );
  }
}
