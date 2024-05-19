import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSlotComponentComponent } from './calendar-slot-component.component';

describe('CalendarSlotComponentComponent', () => {
  let component: CalendarSlotComponentComponent;
  let fixture: ComponentFixture<CalendarSlotComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarSlotComponentComponent]
    });
    fixture = TestBed.createComponent(CalendarSlotComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
