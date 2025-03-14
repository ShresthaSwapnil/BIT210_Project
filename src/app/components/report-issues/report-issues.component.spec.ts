import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIssuesComponent } from './report-issues.component';

describe('ReportIssuesComponent', () => {
  let component: ReportIssuesComponent;
  let fixture: ComponentFixture<ReportIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
