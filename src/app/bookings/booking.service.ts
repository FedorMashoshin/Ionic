import { Booking } from './booking.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: Booking[] = [
   {
    id: 'aaa',
    placeId: '1',
    userId: 'qwq',
    placeTitle: 'Japan Nature',
    guestNumber: 2
   }

  ];

  get bookings(){
    return [...this._bookings]
  }

  constructor() { }
}
