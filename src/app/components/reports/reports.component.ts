import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { IssueService } from '../../services/issue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  imports:[CommonModule,FormsModule,NgxChartsModule]
})
export class ReportsComponent implements OnInit {
  selectedReport = 'pickupStatus';
  filters = { startDate: '', endDate: '', wasteType: '' };
  tableData: any[] = [];
  chartData: any[] = [];
  tableHeaders: string[] = [];
  tableKeys: string[] = [];
  isAdmin = false;

  constructor(private historyService: HistoryService, private issueService: IssueService) {}

  ngOnInit(): void {
    // Identify Admin
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
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
    const pickups = this.historyService.getPickups().filter((p) =>
      this.applyFilterLogic(p.date, p.wasteTypes.includes(this.filters.wasteType))
    );

    this.tableHeaders = ['Date', 'Time', 'Waste Types'];
    this.tableKeys = ['date', 'time', 'wasteTypes'];
    this.tableData = pickups;

    // Chart Data
    const wasteCounts: any = {};
    pickups.forEach((p) => p.wasteTypes.forEach((type: string) => wasteCounts[type] = (wasteCounts[type] || 0) + 1));
    this.chartData = Object.keys(wasteCounts).map((type) => ({ name: type, value: wasteCounts[type] }));
  }

  generateIssueReport(): void {
    const issues = this.issueService.getIssues().filter((i) =>
      this.applyFilterLogic(i.date, i.issueType === this.filters.wasteType)
    );

    this.tableHeaders = ['Issue ID', 'Issue Type', 'Location', 'Date'];
    this.tableKeys = ['issueID', 'issueType', 'location', 'date'];
    this.tableData = this.isAdmin ? issues : issues.filter(i => i.community === JSON.parse(localStorage.getItem('loggedInUser') || '{}').community);

    // Chart Data
    const issueCounts: any = {};
    issues.forEach((i) => issueCounts[i.issueType] = (issueCounts[i.issueType] || 0) + 1);
    this.chartData = Object.keys(issueCounts).map((type) => ({ name: type, value: issueCounts[type] }));
  }

  generateRecyclingReport(): void {
    const pickups = this.historyService.getPickups().filter((p) => p.wasteTypes.includes('recyclable'));

    this.tableHeaders = ['Date', 'Time', 'Recycled Waste'];
    this.tableKeys = ['date', 'time', 'wasteTypes'];
    this.tableData = pickups;

    // Chart Data
    const recyclingCounts: any = {};
    pickups.forEach((p) => recyclingCounts['Recycled'] = (recyclingCounts['Recycled'] || 0) + p.wasteTypes.length);
    this.chartData = Object.keys(recyclingCounts).map((type) => ({ name: type, value: recyclingCounts[type] }));
  }

  applyFilterLogic(date: string, typeMatch: boolean): boolean {
    const pickupDate = new Date(date);
    const isInDateRange = (!this.filters.startDate || pickupDate >= new Date(this.filters.startDate)) &&
                          (!this.filters.endDate || pickupDate <= new Date(this.filters.endDate));
    return isInDateRange && typeMatch;
  }
}
