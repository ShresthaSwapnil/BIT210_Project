import { Component, OnInit } from '@angular/core';
import { PickupService } from '../../services/pickup.service';
import { CommunityService } from '../../services/community.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.scss'],
  standalone: true,
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

  minDate: string = '';

  constructor(
    private pickupService: PickupService,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    this.setMinDate();
    this.communityService.getCommunities().subscribe({
      next: (communities) => {
        this.community = communities.length ? communities[0] : null;
      },
      error: () => {
        console.error('Failed to load communities');
      },
    });
  }

  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    // Format as YYYY-MM-DD
    this.minDate = `${year}-${month}-${day}`;

    if (!this.selectedDate) {
      this.selectedDate = this.minDate;
    }
  }

  schedulePickup(): void {
    // Reset messages
    this.successMessage = '';
    this.errorMessage = '';

    // Basic validation (add more as needed)
    if (!this.selectedDate || !this.selectedTime) {
      this.errorMessage = 'Please select both date and time.';
      return;
    }

    const selectedDateTime = new Date(
      `${this.selectedDate}T${this.selectedTime}`
    );
    const now = new Date();

    // Double check if selected date/time is in the past (though 'min' attribute should prevent date selection)
    if (selectedDateTime < now) {
      // Check if it's today but an earlier time
      const todayDateStr = now.toISOString().split('T')[0];
      if (
        this.selectedDate === todayDateStr &&
        selectedDateTime.getTime() < now.getTime()
      ) {
        this.errorMessage =
          'Selected time is in the past for today. Please choose a future time.';
        return;
      } else if (this.selectedDate < todayDateStr) {
        // This case should ideally be prevented by the min attribute, but good as a fallback check
        this.errorMessage =
          'Selected date is in the past. Please choose today or a future date.';
        return;
      }
    }
    const selectedWaste = Object.keys(this.wasteTypes).filter(
      (key): key is keyof typeof this.wasteTypes =>
        this.wasteTypes[key as keyof typeof this.wasteTypes]
    );

    if (selectedWaste.length === 0) {
      this.errorMessage = 'Please select at least one type of waste!';
      this.successMessage = '';
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );

    const pickup = {
      user: loggedInUser._id,
      community: loggedInUser.community,
      date: this.selectedDate,
      time: this.selectedTime,
      wasteTypes: selectedWaste,
    };

    this.pickupService.schedulePickup(pickup).subscribe({
      next: () => {
        this.successMessage = `Pickup scheduled for ${this.selectedDate} at ${this.selectedTime}.`;
        this.errorMessage = '';
        this.resetForm();
      },
      error: () => {
        this.errorMessage = 'Failed to schedule pickup.';
        this.successMessage = '';
      },
    });
  }

  resetForm() {
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
