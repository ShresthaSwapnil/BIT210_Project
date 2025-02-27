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
    this.notifications = this.notificationService.getNotifications();
  
    // Retrieve logged-in user and check if they are an admin
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.isAdmin = loggedInUser.role === 'admin';
  }
  

  broadcastAnnouncement(): void {
    if (this.announcementText.trim() !== '') {
      this.notificationService.broadcastAnnouncement(this.announcementText);
      this.notifications = this.notificationService.getNotifications();
      this.announcementText = ''; // Clear input field
    }
  }
}
