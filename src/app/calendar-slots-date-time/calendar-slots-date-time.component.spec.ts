import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSlotsDateTimeComponent } from './calendar-slots-date-time.component';

describe('CalendarSlotsDateTimeComponent', () => {
  let component: CalendarSlotsDateTimeComponent;
  let fixture: ComponentFixture<CalendarSlotsDateTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarSlotsDateTimeComponent]
    });
    fixture = TestBed.createComponent(CalendarSlotsDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
