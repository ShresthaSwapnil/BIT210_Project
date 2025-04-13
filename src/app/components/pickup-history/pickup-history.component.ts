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
  filters = {
    startDate: '',
    endDate: '',
    wasteType: '',
  };

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.allPickups = this.historyService.getPickups();
    this.filteredPickups = [...this.allPickups];
    this.generateChartData();
  }

  applyFilters(): void {
    this.filteredPickups = this.historyService.filterPickups(
      { start: this.filters.startDate, end: this.filters.endDate },
      this.filters.wasteType
    );
    this.generateChartData();
  }

  generateChartData(): void {
    const wasteCounts: { [key: string]: number } = {};

    this.filteredPickups.forEach((pickup) => {
      pickup.wasteTypes.forEach((type: string) => {
        wasteCounts[type] = (wasteCounts[type] || 0) + 1;
      });
    });

    this.chartData = Object.keys(wasteCounts).map((type) => ({
      name: this.formatWasteType(type),
      value: wasteCounts[type],
    }));
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
