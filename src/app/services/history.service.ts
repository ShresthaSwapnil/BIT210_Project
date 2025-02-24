import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private pickups = JSON.parse(localStorage.getItem('pickups') || '[]');

  getPickups(): any[] {
    return this.pickups;
  }

  filterPickups(dateRange: any, wasteType: string): any[] {
    return this.pickups.filter((pickup: any) => {
      const pickupDate = new Date(pickup.date);
      const isInDateRange = (!dateRange.start || pickupDate >= new Date(dateRange.start)) &&
                            (!dateRange.end || pickupDate <= new Date(dateRange.end));
      const isTypeMatch = !wasteType || pickup.wasteTypes.includes(wasteType);
      return isInDateRange && isTypeMatch;
    });
  }
}
