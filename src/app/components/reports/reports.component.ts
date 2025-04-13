import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { IssueService } from '../../services/issue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  imports: [CommonModule, FormsModule, NgxChartsModule],
})
export class ReportsComponent implements OnInit {
  selectedReport = 'pickupStatus';
  filters = { startDate: '', endDate: '', wasteType: '' };
  tableData: any[] = [];
  chartData: any[] = [];
  tableHeaders: string[] = [];
  tableKeys: string[] = [];
  isAdmin = false;

  constructor(
    private historyService: HistoryService,
    private issueService: IssueService
  ) {}

  ngOnInit(): void {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    this.isAdmin = loggedInUser.role === 'admin';
    this.generateReport();
  }

  applyFilters(): void {
    this.generateReport();
  }

  generateReport(): void {
    if (this.selectedReport === 'pickupStatus') {
      this.generatePickupReport();
    } else if (this.selectedReport === 'issueReported') {
      this.generateIssueReport();
    } else if (this.selectedReport === 'recyclingRates') {
      this.generateRecyclingReport();
    }
  }

  generatePickupReport(): void {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );

    this.historyService
      .getPickups(
        loggedInUser._id,
        this.isAdmin ? undefined : loggedInUser.community
      )
      .subscribe({
        next: (pickups) => {
          const filteredPickups = this.historyService.filterPickups(
            pickups,
            { start: this.filters.startDate, end: this.filters.endDate },
            this.filters.wasteType
          );

          this.tableHeaders = ['Date', 'Time', 'Waste Types'];
          this.tableKeys = ['date', 'time', 'wasteTypes'];
          this.tableData = filteredPickups;

          const wasteCounts: any = {};
          filteredPickups.forEach((pickup: any) => {
            pickup.wasteTypes.forEach((type: string) => {
              wasteCounts[type] = (wasteCounts[type] || 0) + 1;
            });
          });

          this.chartData = Object.keys(wasteCounts).map((type) => ({
            name: this.formatWasteType(type),
            value: wasteCounts[type],
          }));
        },
        error: () => console.error('Failed to fetch pickups'),
      });
  }

  generateIssueReport(): void {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const filterCommunity = this.isAdmin ? undefined : loggedInUser.community;

    this.issueService.getIssues(filterCommunity).subscribe({
      next: (issues) => {
        const filteredIssues = issues.filter((issue: any) =>
          this.applyFilterLogic(
            issue.date,
            !this.filters.wasteType ||
              issue.issueType === this.filters.wasteType
          )
        );

        this.tableHeaders = ['Issue ID', 'Issue Type', 'Location', 'Community'];
        this.tableKeys = ['issueID', 'issueType', 'location', 'community'];
        this.tableData = filteredIssues;

        const issueCounts: any = {};
        filteredIssues.forEach((issue: any) => {
          issueCounts[issue.issueType] =
            (issueCounts[issue.issueType] || 0) + 1;
        });

        this.chartData = Object.keys(issueCounts).map((type) => ({
          name: type,
          value: issueCounts[type],
        }));
      },
      error: () => console.error('Failed to fetch issues'),
    });
  }

  generateRecyclingReport(): void {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );

    this.historyService
      .getPickups(
        loggedInUser._id,
        this.isAdmin ? undefined : loggedInUser.community
      )
      .subscribe({
        next: (pickups) => {
          const recycledPickups = pickups.filter((pickup: any) =>
            pickup.wasteTypes.includes('recyclable')
          );

          this.tableHeaders = ['Date', 'Time', 'Recycled Waste'];
          this.tableKeys = ['date', 'time', 'wasteTypes'];
          this.tableData = recycledPickups;

          const recyclingCounts: any = {};
          recycledPickups.forEach((pickup: any) => {
            recyclingCounts['Recycled'] =
              (recyclingCounts['Recycled'] || 0) + pickup.wasteTypes.length;
          });

          this.chartData = Object.keys(recyclingCounts).map((type) => ({
            name: type,
            value: recyclingCounts[type],
          }));
        },
        error: () =>
          console.error('Failed to fetch pickups for recycling report'),
      });
  }

  applyFilterLogic(date: string, typeMatch: boolean): boolean {
    const pickupDate = new Date(date);
    const isInDateRange =
      (!this.filters.startDate ||
        pickupDate >= new Date(this.filters.startDate)) &&
      (!this.filters.endDate || pickupDate <= new Date(this.filters.endDate));

    return isInDateRange && typeMatch;
  }

  formatWasteType(type: string): string {
    const types: any = {
      household: 'Household Waste',
      recyclable: 'Recyclable Waste',
      paperPlasticAluminium: 'Paper/Plastic/Aluminium',
      hazardous: 'Hazardous Waste',
    };
    return types[type] || type;
  }
}
