import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<any>(null);
  data$: Observable<any> = this.dataSource.asObservable();
  fetchedEvents: any;

  constructor(private http: HttpClient) {}

  setData(data: any) {
    this.dataSource.next(data);
  }

  fetchEvents(date: string): Observable<any> {
    const apiUrl = `http://localhost:8000/api/return-events-doc?date=${date}`;
    const fetchedObservable = this.http.get<any>(apiUrl);

    return fetchedObservable.pipe(
      tap((data) => {
        this.fetchedEvents = data;
        this.setData(data);
      }),
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(error);
      })
    );
  }

  fetchScheduleConfig(date: string): Observable<any> {
    const apiUrl = `http://localhost:8000/api/return-schedule-config?day=${date}`;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => {
        this.setData(data);
      }),
      catchError((error) => {
        console.error('Error fetching schedule:', error);
        return throwError(error);
      })
    );
  }
}
