import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SchedulePickupComponent } from './components/schedule-pickup/schedule-pickup.component';
import { HomeComponent } from './components/home/home.component';
import { ReportIssuesComponent } from './components/report-issues/report-issues.component';
import { PickupHistoryComponent } from './components/pickup-history/pickup-history.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
    {path:'', component:LandingComponent},
    {path:'register',component:AuthComponent},
    {path:'dashboard',component:DashboardComponent,
        children:[
            {path:'',redirectTo: 'home', pathMatch: 'full' },
            {path:'home',component:HomeComponent},
            {path:'schedule',component:SchedulePickupComponent},
            {path:'report-issues',component:ReportIssuesComponent},
            {path:'history',component:PickupHistoryComponent},
            {path:'notifications',component:NotificationsComponent},
            {path:'reports',component:ReportsComponent},
        ]},
];
