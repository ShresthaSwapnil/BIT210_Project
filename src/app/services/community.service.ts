import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private apiUrl = 'http://localhost:5000/api/communities';

  constructor(private http: HttpClient) {}

  // Add community to the database
  addCommunity(community: any): Observable<any> {
    return this.http.post(this.apiUrl, community);
  }

  // Fetch all communities from the database
  getCommunities(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Check if a community exists by name
  checkCommunityExists(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?name=${name}`);
  }
}
