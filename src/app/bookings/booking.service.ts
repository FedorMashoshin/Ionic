import { delay, take, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from './../auth/auth.service';
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface BookingData{
  dateFrom: string;
  dateTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
  

}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([])

  get bookings(){
    return this._bookings.asObservable()
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ){

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
      let generatedId: string; 
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
      return this.http
      .post<{name: string}>(
        `https://ionic-project-9efe5.firebaseio.com/bookings.json`,
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap(res => {
        generatedId = res.name;
        return this.bookings
      }),
        take(1),
        tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
        console.log(newBooking)
      }
      ))
    }

  cancelBooking(bookingId){
    return this.http.delete(
      `https://ionic-project-9efe5.firebaseio.com/bookings/${bookingId}.json`
    ). 
    pipe(
      switchMap(() => {
        return this.bookings;
     }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }

  fetchBookings(){
    return this.http.get<{[key: string]: BookingData}>(
      `https://ionic-project-9efe5.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${
        this.authService.userId
      }"`
    ).pipe(
      map(
        bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)){
              bookings.push(
                new Booking(
                  key, 
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  new Date(bookingData[key].dateFrom),
                  new Date(bookingData[key].dateTo)
                )
              );
            }
          }
          return bookings;
        }
      ), tap(bookings => {
        this._bookings.next(bookings);
      })
    )
  }
}
