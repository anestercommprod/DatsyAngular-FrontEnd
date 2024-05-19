import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
    constructor(private titleService: Title) { }

    title = 'Datsy - Home';

    // slots
    markedSlot: HTMLElement | null = null;
    markedSlotTime: string | null = null;
    lsDate: string | null = null;




    // mark current event visible 
    getCurrentTimeInMoscow(): Date {
        const moscowTimeZone = 'Europe/Moscow';
        const currentTime = new Date();
        return new Date(currentTime.toLocaleString('en-US', { timeZone: moscowTimeZone }));
    }
    getStyle(): { [key: string]: string } {
        const currentTime = this.getCurrentTimeInMoscow();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const closestTime = this.getClosestTime(hours, minutes);

        this.markedSlot = document.getElementById(closestTime.toString()) as HTMLElement;
        this.markedSlotTime = closestTime;
        console.log(closestTime);

        if (this.markedSlot) {
            this.markedSlot.style.backgroundColor = '';
        }

        this.markedSlotTime = closestTime;
        if (this.markedSlot) {
            this.markedSlot.style.backgroundColor = 'rgb(200, 54, 54)';
            console.log(this.markedSlot);
        }

        return {
            'background-color': 'rgb(200, 54, 54)',
        };
    }

    getClosestTime(currentHours: number, currentMinutes: number): string {
        const baseHours = 8;
        const slotMinutes = 20;
        const totalSlots = ((22 - baseHours) * 60) / slotMinutes;

        const totalCurrentMinutes = (currentHours - baseHours) * 60 + currentMinutes;
        const closestSlotIndex = Math.floor(totalCurrentMinutes / slotMinutes);

        const closestHours = baseHours + Math.floor(closestSlotIndex * slotMinutes / 60);
        const closestMinutes = closestSlotIndex * slotMinutes % 60;

        return `${String(closestHours).padStart(2, '0')}:${String(closestMinutes).padStart(2, '0')}`;
    }

    ngAfterViewInit(): void {
        // mark current slot
        this.getStyle();
        setInterval(() => {
            // Update the style every minute
            this.getStyle();
        }, 60000);
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
    }
}
