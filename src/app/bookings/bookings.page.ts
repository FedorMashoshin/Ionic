import { Subscription } from 'rxjs';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSub: Subscription;

  constructor(
    private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    })
  }

  onCancel(bookingId: string, bookingSliding: IonItemSliding){
    bookingSliding.close();
  }

  ngOnDestroy(){
    if (this.bookingSub){
      this.bookingSub.unsubscribe(); 
    }
  }

}
