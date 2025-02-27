import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

  getNotifications(): any[] {
    return this.notifications;
  }

  addNotification(notification: any): void {
    this.notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  broadcastAnnouncement(message: string): void {
    const announcement = {
      id: 'ANN-' + new Date().getTime(),
      message: message,
      type: 'announcement',
      date: new Date().toISOString(),
    };
    this.addNotification(announcement);
  }
}
