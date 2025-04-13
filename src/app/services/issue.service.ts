import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private apiUrl = 'http://localhost:5000/api/issues';

  constructor(private http: HttpClient) {}

  logIssue(issue: any): Observable<any> {
    return this.http.post(this.apiUrl, issue);
  }

  getIssues(community?: string, userId?: string): Observable<any> {
    let url = this.apiUrl;
    const params = [];
    if (community) params.push(`community=${community}`);
    if (userId) params.push(`user=${userId}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get(url);
  }
}
