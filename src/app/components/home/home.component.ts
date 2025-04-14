import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pickupData: any[] = [];
  wasteTypeData: any[] = [];
  totalPickups = 0;

  // Chart configuration
  view: [number, number] = [800, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Waste Type';
  showYAxisLabel = true;
  yAxisLabel = 'No. of Pickups';
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  loggedInUser: any;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Fetch only pickups for this user's community
    this.historyService
      .getPickups(undefined, this.loggedInUser.community)
      .subscribe({
        next: (pickups: any[]) => {
          this.totalPickups = pickups.length;

          // Count each waste type
          const wasteCount: any = {
            Household: 0,
            Recyclable: 0,
            'Paper/Plastic/Aluminium': 0,
            Hazardous: 0,
          };

          pickups.forEach((pickup) => {
            pickup.wasteTypes.forEach((type: string) => {
              if (type === 'household') {
                wasteCount.Household++;
              } else if (type === 'recyclable') {
                wasteCount.Recyclable++;
              } else if (type === 'paperPlasticAluminium') {
                wasteCount['Paper/Plastic/Aluminium']++;
              } else if (type === 'hazardous') {
                wasteCount.Hazardous++;
              }
            });
          });

          // Prepare chart data
          this.wasteTypeData = Object.keys(wasteCount).map((type) => ({
            name: type,
            value: wasteCount[type],
          }));

          // Prepare table data
          this.pickupData = pickups.map((p) => ({
            community: p.community,
            date: p.date,
            time: p.time,
            wasteTypes: p.wasteTypes.join(', '),
          }));
        },
        error: (err) => {
          console.error('Failed to load pickups:', err);
        },
      });
  }
}
