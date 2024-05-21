import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { Subject, Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-calendar-slots-date-time',
    templateUrl: './calendar-slots-date-time.component.html',
    styleUrls: ['./calendar-slots-date-time.component.css']
})
export class CalendarSlotsDateTimeComponent {
    constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) { }

    selectedDate: string;
    isLoading = false;
    reloadPage: boolean = false;
    private dateUpdated = new Subject<string>();


    private fetchDataSubscription: Subscription;



    ngOnInit() {
        this.setToday();
        this.subscribeToDateUpdates();
    }

    setToday() {
        this.route.queryParams.subscribe(params => {
            if (params['date']) {
                this.selectedDate = params['date'];
            } else {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                this.selectedDate = `${day}-${month}-${year}`;
            }
            this.fetchData();
        });
    }

    updateDate(offset: number) {
        const currentDate = new Date(this.selectedDate.split('-').reverse().join('-'));
        currentDate.setDate(currentDate.getDate() + offset);
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        this.selectedDate = `${day}-${month}-${year}`;
        this.dateUpdated.next(this.selectedDate);

        localStorage.setItem('currentDate', this.selectedDate);

        if (offset != 0) {
            this.reloadPage = true;
        }
    }

    private subscribeToDateUpdates() {
        this.dateUpdated.pipe(
            debounceTime(360)
        ).subscribe((date) => {
            this.isLoading = true;
            if (this.reloadPage == true) {
                const url = window.location.href.split('/').slice(0, 3).join('/') + "/?date=" + this.selectedDate
                window.open(url, '_self');
                return;
            }
            this.fetchData();
        });
    }


    private fetchData() {
        console.log('Fetching data from Datsy database...')
        const delay = 360;

        this.isLoading = true;
        if (this.fetchDataSubscription) {
            this.fetchDataSubscription.unsubscribe();
        }
        this.fetchDataSubscription = new Subscription();
        this.fetchDataSubscription.add(
            this.dataService.fetchEvents(this.selectedDate).subscribe(
                (data) => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, delay);
                },
                (error) => {
                    console.error('Error fetching events:', error);
                    this.isLoading = false;
                },
                () => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, delay);
                }
            )
        );
    }



    ngOnDestroy() {
        if (this.fetchDataSubscription) {
            this.fetchDataSubscription.unsubscribe();
        }
    }
}