import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  private pickups = JSON.parse(localStorage.getItem('pickups') || '[]');

  schedulePickup(pickup: any): void {
    this.pickups.push(pickup);
    localStorage.setItem('pickups', JSON.stringify(this.pickups));
  }

  getPickups(): any[] {
    return this.pickups;
  }
}
