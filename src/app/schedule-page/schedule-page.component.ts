import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../shared/data.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-schedule-page',
    templateUrl: './schedule-page.component.html',
    styleUrls: ['./schedule-page.component.css']
})

export class SchedulePageComponent implements OnInit {
    title = 'Datsy - Schedule';
    statuses: string[] = ['Work', 'Box', 'Lunch', 'Quest', 'Meeting'];
    scheduleApiUrl = 'http://localhost:8000/api';
    scheduleConfig: string = '';
    currentStatus: string = 'Work';
    employeeList = [
        'Alexander Nester',
        'Alexander Del',
        'Artem Kamyshan',
        'Antonina Lazukova',
        'Andrey Paschenko',
        'Maxim Sultanov'
    ];
    selectedDate: string = "Loading...";
    selectedDate_day: string = "";
    times: string[] = [];
    employees: { name: string, schedule: { [key: string]: string } }[] = [];
    isLoading: boolean = true;

    constructor(
        private titleService: Title,
        private http: HttpClient,
        private dataService: DataService
    ) {
        this.generateTimes();
        this.employees = this.generateEmployees();
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.setSelectedDateToToday();
        this.fetchSchedule();
    }

    // Status
    setStatus(status: string) {
        this.currentStatus = status;
    }

    // Schedule
    generateTimes() {
        const startTime = 8 * 60; // 8:00 AM in minutes
        const endTime = 23 * 60; // 11:00 PM in minutes
        const interval = 20; // 20 minutes interval

        for (let time = startTime; time < endTime; time += interval) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            this.times.push(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
        }
    }

    generateEmployees() {
        return this.employeeList.map(name => ({
            name: name,
            schedule: this.times.reduce((acc, time) => {
                acc[time] = ''; // Initialize with an empty string
                return acc;
            }, {})
        }));
    }

    formatTime(time: string): string {
        const [hours, minutes] = time.split(':');
        return `${hours}<br>${minutes}`;
    }

    toggleStatus(employeeName: string, time: string) {
        const employee = this.employees.find(e => e.name === employeeName);
        if (employee) {
            employee.schedule[time] = employee.schedule[time] === this.currentStatus ? '' : this.currentStatus;
        }
    }

    saveSchedule() {
        const schedule = this.employees.reduce((acc, employee) => {
            const employeeSchedule = this.times.reduce((timeAcc, time) => {
                timeAcc[time.replace(':', '')] = employee.schedule[time] || '0';
                return timeAcc;
            }, {});
            acc[employee.name] = employeeSchedule;
            return acc;
        }, {});

        this.scheduleConfig = JSON.stringify(schedule, null, 2);

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const body = `day=${encodeURIComponent(this.selectedDate)}&config=${encodeURIComponent(this.scheduleConfig)}`;

        this.http.post(`${this.scheduleApiUrl}/set-schedule-config`, body, { headers })
            .subscribe(response => {
                console.log('Config saved successfully:', response);
            }, error => {
                console.error('Error saving config:', error);
            });

        console.log(this.scheduleConfig);
    }

    // Date
    formatDate(date: Date): string {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    setSelectedDateToToday() {
        const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        this.selectedDate = this.formatDate(today);
        this.selectedDate_day = " - " + today.toLocaleString('en-US', { weekday: 'long' });
    }

    onDateChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const date = new Date(input.value);
        this.selectedDate = this.formatDate(date);
        this.fetchSchedule();
    }

    openDatePicker() {
        console.log('init');
        const input = document.getElementById('invisible-date') as HTMLInputElement;
        if (input.showPicker) {
            input.showPicker();
            console.log('opened');
        } else {
            alert('not supported');
        }
    }

    // Schedule workflow
    fetchSchedule() {
        this.isLoading = true;
        this.dataService.fetchScheduleConfig(this.selectedDate).subscribe(data => {
            this.applySchedule(data);
            this.isLoading = false;
        }, error => {
            console.error('Error fetching schedule:', error);
            this.isLoading = false;
        });
    }

    applySchedule(schedule: any) {
        this.employees.forEach(employee => {
            this.scheduleConfig = JSON.parse(schedule.config);
            console.log(this.scheduleConfig);
            const employeeSchedule = this.scheduleConfig[employee.name];
            if (employeeSchedule) {
                this.times.forEach(time => {
                    const formattedTime = time.replace(':', '');
                    employee.schedule[time] = employeeSchedule[formattedTime] || '';
                });
            }
        });
    }
}