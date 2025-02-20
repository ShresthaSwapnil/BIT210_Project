import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PickupService } from '../../services/pickup.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  pickupData: any[] = [];
  wasteTypeData: any[] = [];
  totalPickups = 0;

  // Chart Config
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Waste Type';
  showYAxisLabel = true;
  yAxisLabel = 'No. of Pickups';
  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };

  constructor(private pickupService: PickupService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const pickups = this.pickupService.getPickups();
    this.totalPickups = pickups.length;

    // Count waste types
    const wasteCount: any = {
      Household: 0,
      Recyclable: 0,
      'Paper/Plastic/Aluminium': 0,
      Hazardous: 0,
    };

    pickups.forEach((pickup) => {
      pickup.wasteTypes.forEach((type: string) => {
        if (wasteCount[type]) wasteCount[type]++;
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
  }
}
