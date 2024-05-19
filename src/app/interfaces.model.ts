export interface CalendarSlotEvent {
  eventId: number;
  eventText: string;
  eventOwner: number;
  eventTime: number;
  eventDate: string;
  eventIsAssigned: number;
  eventAssigneeId: number;
}

export interface CalendarSlotEvents {
  [key: string]: CalendarSlotEvent[];
}