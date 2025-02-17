import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private communities = JSON.parse(localStorage.getItem('communities') || '[]');

  addCommunity(community: any): void {
    this.communities.push(community);
    localStorage.setItem('communities', JSON.stringify(this.communities));
  }

  getCommunities(): any[] {
    return this.communities;
  }

  isCommunityExists(name: string): boolean {
    return this.communities.some((c: { name: string; }) => c.name === name);
  }
}
