import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from './../auth/auth.service';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([])

  get bookings(){
    return this._bookings.asObservable()
  }

  constructor(private authService: AuthService){

  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
    )
    {
      const newBooking = new Booking(
        Math.random().toString(),
        placeId,
        this.authService.userId,
        placeTitle,
        placeImage,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo
      );
      return this.bookings.pipe(
        take(1),
        delay(1000),
        tap(bookings => {
          this._bookings.next(bookings.concat(newBooking));
        })
        );
    }

  cancelBookig(){}
}
