import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  private apiUrl = 'http://localhost:5000/api/pickups';

  constructor(private http: HttpClient) {}

  schedulePickup(pickup: any): Observable<any> {
    return this.http.post(this.apiUrl, pickup);
  }

  getPickups(userId?: string, community?: string): Observable<any> {
    let url = this.apiUrl;
    if (userId) url += `?user=${userId}`;
    if (community) url += `?community=${community}`;
    return this.http.get(url);
  }
}
