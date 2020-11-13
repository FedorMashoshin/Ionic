import { AuthService } from './../../../auth/auth.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Place } from '../../place.mode';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy{
  place: Place;
  isBookable: boolean = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
        this.place = place;
        this.isBookable = place.userId !==  this.authService.userId
      });
    })
  }

  ngOnDestroy(){
    if (this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
  
  onBookPlace(){
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select')
          }
        }, 
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random')
          }
        }, 
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
    .then(actionSheetEl => {
      actionSheetEl.present()
    })
  }

// TS feature (exact string select or random)
  openBookingModal(mode: 'select' | 'random'){
    console.log(mode)

    // modal window creating
    this.modalCtrl.create({
      component: CreateBookingComponent,
      // data transform to our modal
      componentProps: {selectedPlace: this.place, selectedMode: mode}
    })
    // modal window opening
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role)
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: 'Booking place...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.image,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.dateFrom,
            data.dateTo
          ).subscribe(() => {
            loadingEl.dismiss();
          })
        })
       
      }
    })
  }
}
