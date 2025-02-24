import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private issues = JSON.parse(localStorage.getItem('issues') || '[]');

  logIssue(issue: any): void {
    this.issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(this.issues));
  }

  getIssues(): any[] {
    return this.issues;
  }
}
