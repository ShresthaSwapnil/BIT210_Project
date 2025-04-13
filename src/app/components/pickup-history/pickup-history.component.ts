import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pickup-history',
  templateUrl: './pickup-history.component.html',
  imports: [CommonModule, FormsModule, NgxChartsModule],
})
export class PickupHistoryComponent implements OnInit {
  allPickups: any[] = [];
  filteredPickups: any[] = [];
  chartData: any[] = [];
  isAdmin = false;
  tableData: any[] = [];
  tableHeaders: string[] = [];
  tableKeys: string[] = [];

  filters = {
    startDate: '',
    endDate: '',
    wasteType: '',
  };

  view: [number, number] = [700, 400];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    this.isAdmin = loggedInUser.role === 'admin';
    this.loadPickupHistory();
  }

  applyFilters(): void {
    this.loadPickupHistory();
  }

  loadPickupHistory(): void {
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
        error: (err) => console.error('Failed to load pickups:', err),
      });
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
