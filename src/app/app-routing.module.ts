import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'schedule', component: SchedulePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
