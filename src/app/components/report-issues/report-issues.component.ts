import { Component } from '@angular/core';
import { IssueService } from '../../services/issue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-issues',
  templateUrl: './report-issues.component.html',
  imports:[CommonModule,FormsModule]
})
export class ReportIssuesComponent {
  issueType = '';
  location = '';
  description = '';
  comments = '';
  photo: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private issueService: IssueService) {}

  // Capture file input (dummy handling)
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.photo = event.target.files[0];
    }
  }

  // Handle form submission
  submitIssue(form: any): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields!';
      this.successMessage = '';
      return;
    }

    // Generate a unique Issue ID
    const issueID = 'ISSUE-' + new Date().getTime();

    // Create the issue object
    const issue = {
      issueID: issueID,
      issueType: this.issueType,
      location: this.location,
      description: this.description,
      comments: this.comments,
      photo: this.photo ? this.photo.name : null, // For dummy purposes
      status: 'NEW'
    };

    // Log the issue using the IssueService
    this.issueService.logIssue(issue);

    // Display a success notification with the unique Issue ID
    this.successMessage = `Issue reported successfully! Your Issue ID is ${issueID} with status NEW.`;
    this.errorMessage = '';

    // Reset the form fields
    this.issueType = '';
    this.location = '';
    this.description = '';
    this.comments = '';
    this.photo = null;
    form.resetForm();
  }
}
