import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private communities: any[] = [];

  constructor() {
    this.loadCommunities();
  }

  private loadCommunities(): void {
    // Always load fresh data from localStorage
    this.communities = JSON.parse(localStorage.getItem('communities') || '[]');
  }

  addCommunity(community: any): void {
    this.loadCommunities(); // Refresh before adding
    this.communities.push(community);
    localStorage.setItem('communities', JSON.stringify(this.communities));
  }

  getCommunities(): any[] {
    this.loadCommunities(); // Always get fresh data
    return this.communities;
  }

  isCommunityExists(name: string): boolean {
    this.loadCommunities(); // Always get fresh data
    return this.communities.some((c: { name: string; }) => c.name === name);
  }
}