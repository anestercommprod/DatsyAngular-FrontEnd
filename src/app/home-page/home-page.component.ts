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
        const numericOffset = Number(0);
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const closestTime = String(Number(this.getClosestTime(hours, minutes).replace(':', '').replace('-', '')) + numericOffset);

        this.markedSlot = document.getElementById(closestTime.toString()) as HTMLElement;
        this.markedSlotTime = closestTime;

        if (this.markedSlot) {
            this.markedSlot.style.backgroundColor = '';
        }

        this.markedSlotTime = closestTime;
        if (this.markedSlot) {
            this.markedSlot.style.boxShadow = '0px 0px 4px rgb(33, 150, 243, 0.5)';
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



    // Open previous event after creating an event
    openEvent(timeout: number = 0): void {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const newUrlParams = new URLSearchParams(queryString);
        newUrlParams.delete('openEvent')
        const newUrl = window.location.origin + window.location.pathname + '?' + newUrlParams.toString();
        history.replaceState(null, '', newUrl);

        setTimeout(() => {
            if (urlParams.has('openEvent')) {
                const openEventValue = urlParams.get('openEvent');
                document.getElementById(openEventValue).click();
                urlParams.delete('openEvent');
            }
        }, timeout);
    }



    ngAfterViewInit(): void {
        // mark current slot
        setTimeout(() => {
            this.getStyle();
        }, 512);
        setInterval(() => {
            // Update the style every minute
            this.getStyle();
        }, 60000);
    }

    ngOnInit() {
        this.openEvent(1024);
        this.titleService.setTitle(this.title);
    }
}
