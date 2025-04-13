import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams();
    if (userId) {
      params = params.set('user', userId);
    }
    if (community) {
      params = params.set('community', community);
    }
    return this.http.get(this.apiUrl, { params });
  }
}
