import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private apiUrl = 'http://localhost:5000/api/pickups';

  constructor(private http: HttpClient) {}

  // Fetch pickups (optionally filter by user or community)
  getPickups(userId?: string, community?: string): Observable<any[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user', userId);
    if (community) params = params.set('community', community);

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Client-side filtering after fetching all pickups
  filterPickups(pickups: any[], dateRange: any, wasteType: string): any[] {
    return pickups.filter((pickup: any) => {
      const pickupDate = new Date(pickup.date);
      const isInDateRange =
        (!dateRange.start || pickupDate >= new Date(dateRange.start)) &&
        (!dateRange.end || pickupDate <= new Date(dateRange.end));
      const isTypeMatch = !wasteType || pickup.wasteTypes.includes(wasteType);

      return isInDateRange && isTypeMatch;
    });
  }
}
