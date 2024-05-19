import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent {
  userRole: number | null = null;
  isLogged: number | null = null;

  ngOnInit(): void {
    // Retrieve userRole from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    this.userRole = storedUserRole !== null ? parseInt(storedUserRole, 10) : null;

    const isLoggedVal = localStorage.getItem('isLogged');
    this.isLogged = isLoggedVal !== null ? parseInt(isLoggedVal, 10) : null;
}
}
