import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.mode';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f' , { static: true }) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const dateFrom = new Date(this.selectedPlace.dateFrom);
    const dateTo = new Date(this.selectedPlace.dateTo);
    if (this.selectedMode === 'random'){
      // - 1 week at the end
      this.startDate = new Date(dateFrom.getTime() + 
        Math.random() * 
        (dateTo.getTime() - 7 * 24 * 60 * 60 * 1000 - dateFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() + 
        Math.random() * 
        (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())
      ).toISOString()
    }
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBooking(){
    if (!this.form.valid) return;
    this.modalCtrl.dismiss({
      bookingData:{
        firstName : this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestNumber: this.form.value['guest-number'],
        startDate: new Date(this.form.value['date-from']),
        endDate: new Date(this.form.value['date-to'])
      }
    }, 'confirm');
  }

  datesValid(){
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
