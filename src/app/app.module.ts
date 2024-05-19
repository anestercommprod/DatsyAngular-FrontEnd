import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarSlotComponentComponent } from './calendar-slot-component/calendar-slot-component.component';
import { CalendarSlotsDateTimeComponent } from './calendar-slots-date-time/calendar-slots-date-time.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CalendarSlotComponentComponent,
    CalendarSlotsDateTimeComponent,
    CalendarHeaderComponent,
    SchedulePageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
