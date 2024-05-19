import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-schedule-page',
    templateUrl: './schedule-page.component.html',
    styleUrls: ['./schedule-page.component.css']
})

export class SchedulePageComponent {
    title = 'Datsy - Schedule';

    statuses: string[] = [
        'Work',
        'Box',
        'Lunch',
        'Quest',
        'Meeting'
    ];
    currentStatus: string = 'Work';
    employeeList = [
        'Alexander Nester',
        'Alexander Del',
        'Artem Kamyshan',
        'Antonina Lazukova',
        'Andrey Paschenko',
        'Maxim Sultanov'
    ];
    selectedDate: string = "Loading..."
    selectedDate_day: string = ""


    times: string[] = [];
    employees: { name: string, schedule: { [key: string]: string } }[] = [];

    constructor(private titleService: Title) {
        this.generateTimes();
        this.employees = this.generateEmployees();
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
        const names = this.employeeList;
        return names.map(name => ({
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

        console.log(JSON.stringify(schedule, null, 2));
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
    }


    openDatePicker() {
        console.log('init')
        const input = document.getElementById('invisible-date') as HTMLInputElement;
        if (input.showPicker) {
            input.showPicker();
            console.log('opened')
        } else {
            alert('not supported')
        }
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.setSelectedDateToToday();
    }
}