import { Component, OnInit } from '@angular/core';
import { PickupService } from '../../services/pickup.service';
import { CommunityService } from '../../services/community.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class SchedulePickupComponent implements OnInit {
  community: any = null;
  selectedDate = '';
  selectedTime = '';
  wasteTypes = {
    household: false,
    recyclable: false,
    paperPlasticAluminium: false,
    hazardous: false,
  };
  successMessage = '';
  errorMessage = '';

  constructor(private pickupService: PickupService, private communityService: CommunityService) {}

  ngOnInit(): void {
    // Fetching the first community for now (can be modified for logged-in user)
    const communities = this.communityService.getCommunities();
    this.community = communities.length ? communities[0] : null;
  }

  schedulePickup(): void {
    // Check if at least one waste type is selected
    const selectedWaste = Object.keys(this.wasteTypes).filter((key): key is keyof typeof this.wasteTypes => this.wasteTypes[key as keyof typeof this.wasteTypes]);
    if (selectedWaste.length === 0) {
      this.errorMessage = 'Please select at least one type of waste!';
      this.successMessage = '';
      return;
    }

    // Prepare pickup data
    const pickup = {
      community: this.community?.name || 'Unknown',
      date: this.selectedDate,
      time: this.selectedTime,
      wasteTypes: selectedWaste,
    };

    // Save to local storage
    this.pickupService.schedulePickup(pickup);

    // Confirmation message
    this.successMessage = `Pickup scheduled for ${this.selectedDate} at ${this.selectedTime}.`;
    this.errorMessage = '';

    // Reset form
    this.selectedDate = '';
    this.selectedTime = '';
    this.wasteTypes = {
      household: false,
      recyclable: false,
      paperPlasticAluminium: false,
      hazardous: false,
    };
  }
}
