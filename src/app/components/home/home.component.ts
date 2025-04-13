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
    // Example: Fetch pickups for the logged-in user or community (optional filtering)
    this.pickupService.getPickups().subscribe({
      next: (pickups) => {
        this.totalPickups = pickups.length;
  
        // Count waste types
        const wasteCount: any = {
          Household: 0,
          Recyclable: 0,
          'Paper/Plastic/Aluminium': 0,
          Hazardous: 0,
        };
  
        pickups.forEach((pickup: any) => {
          pickup.wasteTypes.forEach((type: string) => {
            // You might need to format the keys to match wasteCount keys
            if (type === 'household') wasteCount.Household++;
            if (type === 'recyclable') wasteCount.Recyclable++;
            if (type === 'paperPlasticAluminium') wasteCount['Paper/Plastic/Aluminium']++;
            if (type === 'hazardous') wasteCount.Hazardous++;
          });
        });
  
        // Prepare chart data
        this.wasteTypeData = Object.keys(wasteCount).map((type) => ({
          name: type,
          value: wasteCount[type],
        }));
  
        // Prepare table data
        this.pickupData = pickups.map((p: any) => ({
          community: p.community,
          date: p.date,
          time: p.time,
          wasteTypes: p.wasteTypes.join(', '),
        }));
      },
      error: (err) => {
        console.error('Failed to load pickups:', err);
      }
    });
  }  
}
