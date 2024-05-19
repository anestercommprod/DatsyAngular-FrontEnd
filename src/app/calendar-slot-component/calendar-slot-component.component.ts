import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-calendar-slot-component',
    templateUrl: './calendar-slot-component.component.html',
    styleUrls: ['./calendar-slot-component.component.css']
})
export class CalendarSlotComponentComponent {
    @ViewChild('newEventText', { static: false }) newEventText!: ElementRef;

    events: any[] = [];
    dataFetched: boolean = false;

    eventId: number = 0;
    eventTime: string = "";
    eventHolderId: string = "";
    eventHolderName: string = "";
    eventCreatorId: string = "";
    eventCreatorName: string = "";
    eventText: string = "";
    eventsAmount: number = 0;
    eventsAmountMax: number = 2;

    private usedEventIndices: Set<number> = new Set<number>();

    constructor(private dataService: DataService, private http: HttpClient) { }



    public getLoopLimit(): number {
        return Math.max(this.eventsAmountMax, Math.min(this.eventsAmount, this.eventsAmount));
    }

    toggleMaxHeight(element: HTMLElement) {
        const multiplierScale = element.children.length * 36;
        // Check if the element has inline style
        if (element.style.maxHeight != '') {
            // If it has inline style, remove it
            element.style.removeProperty('max-height');
        }
        else {
            // If it doesn't have inline style, add it
            element.style.maxHeight = multiplierScale + 'px';
        }
    }

    // easify slots generation for p tag within
    @Input() slotIndex!: number;
    startTime: string = '08:00'; // Default start time

    calculateTime(index: number): string {
        const minutesToAdd = index * 20; // Each slot is 20 minutes apart
        const startTimeParts = this.startTime.split(':');
        const startDateTime = new Date(2000, 0, 1, parseInt(startTimeParts[0], 10), parseInt(startTimeParts[1], 10));
        startDateTime.setMinutes(startDateTime.getMinutes() + minutesToAdd);

        const newHours = startDateTime.getHours().toString().padStart(2, '0');
        const newMinutes = startDateTime.getMinutes().toString().padStart(2, '0');

        this.eventTime = (startDateTime.getHours() + newMinutes)

        return `${newHours}:${newMinutes}`;
    }
    setElementId(index: number): string {
        const minutesToAdd = index * 20; // Each slot is 20 minutes apart
        const startTimeParts = this.startTime.split(':');
        const startDateTime = new Date(2000, 0, 1, parseInt(startTimeParts[0], 10), parseInt(startTimeParts[1], 10));
        startDateTime.setMinutes(startDateTime.getMinutes() + minutesToAdd);

        // Extract hours and minutes, and format them
        const newHours = startDateTime.getHours().toString();
        const newMinutes = startDateTime.getMinutes().toString().padStart(2, '0'); // Keep leading zero for minutes

        // Concatenate without colon, remove leading zeros by converting to number then back to string
        const elementId = parseInt(`${newHours}${newMinutes}`, 10).toString();

        return elementId;
    }

    shouldUseOption1(eventTime: string, slotIndex: number): boolean {
        // Check if 'this.events' is an array and has elements
        if (Array.isArray(this.events) && this.events.length > 0) {
            for (const eventGroup of this.events) {
                // Ensure eventGroup has the 'events' array
                if (eventGroup && Array.isArray(eventGroup.events)) {
                    // Use slotIndex to access the specific event within the events array
                    const event = eventGroup.events[slotIndex];
                    if (event != null && event.eventTime === eventTime) {
                        this.eventsAmount = eventGroup.events.length;
                        this.eventText = event.eventText;
                        this.eventHolderId = event.eventAssigneeId;
                        this.eventId = event.eventId;
                        this.getNameById(this.eventHolderId, 'holder');
                        this.eventCreatorId = event.eventOwner;
                        this.getNameById(this.eventCreatorId, 'creator');
    
                        return true;  // Return true if a matching event is found
                    }
                }
            }
        }
    
        return false;  // Return false if no matching event is found
    }
    


    getNameById(userId: string, type: 'holder' | 'creator'): void {
        let cache = localStorage.getItem('nameCache');
        let nameCache: { [id: string]: string } = cache ? JSON.parse(cache) : {};
    
        if (!nameCache.hasOwnProperty(userId)) {
            nameCache[userId] = 'undefined';
            localStorage.setItem('nameCache', JSON.stringify(nameCache));
    
            this.fetchNameById(userId).then((name: string) => {
                nameCache[userId] = name.replace(/(\w)\w*\s(\w+)/, "$1. $2");
                localStorage.setItem('nameCache', JSON.stringify(nameCache));
    
                if (type === 'holder') {
                    this.eventHolderName = nameCache[userId].split(" ")[0];
                } else if (type === 'creator') {
                    this.eventCreatorName = nameCache[userId].split(" ")[0];
                }
    
                return nameCache[userId];
            }).catch(error => {
                console.error('Error fetching name by id:', error);
            });
        } else {
            if (type === 'holder') {
                this.eventHolderName = nameCache[userId];
            } else if (type === 'creator') {
                this.eventCreatorName = nameCache[userId] + ` (${this.eventCreatorId})`;
            }
        }
    }
    
    private fetchNameById(id: string): Promise<string> {
        return this.http.get(`http://localhost:8000/proxy/person/${id}`, { responseType: 'text' }).toPromise().then((name) => {
            if(name == 'NotAssigned') return '';
            return name || 'Undefined (no name)';
        })
        .catch(error => {
            console.error('Error fetching name by id:', JSON.stringify(error));
            return 'Error fetching name: ' + error;
        });
    }
    
    



    // Create event
    createEvent(): void {
        const url = 'http://localhost:8000/api/set-event-doc';
        const eventData = {
            eventText: this.newEventText.nativeElement.value,
            eventOwner: Number(localStorage.getItem('crm2id')), // You can provide a value here if needed
            eventTime: this.setElementId(this.slotIndex), // You can provide a value here if needed
            eventDate: localStorage.getItem('currentDate') // You can provide a value here if needed
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.http.post(url, eventData, { headers })
            .subscribe(
                response => {
                    console.log('Event created successfully:', response);
                    // Optionally, you can handle success response here
                },
                error => {
                    console.error('Error creating event:', error);
                    if (error.status == '418') {
                        alert('Event already exists!');
                    }
                    // Optionally, you can handle error response here
                }
            );
    }

    // Delete event




    ngOnInit() {
        this.subscribeToDataService();
    }
    private dataSubscription: Subscription;

    subscribeToDataService() {
        this.dataSubscription = this.dataService.data$.subscribe(data => {
            if (data) {
                this.storeEvents(data);
                setTimeout(() => {
                    this.dataFetched = true;
                }, 512);
            }
        });
    }

    storeEvents(fetchedEvents: any[]) {
        if (this.eventTime !== '' && fetchedEvents[Number(this.eventTime)].eventsAmount != 0) 
        {
            const event = fetchedEvents[Number(this.eventTime)];
            this.events.push(event);
            this.eventsAmount = event.eventsAmount;
            console.log('hi baby!!!', this.eventTime, this.events)
        }
    }
}
