import { Place } from './../../place.mode';
import { PlacesPageRoutingModule } from './../../places-routing.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
place: Place;
form: FormGroup; 
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private placesSub: Subscription
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          // 2 params: 1-starting value, 2- what we want to change
          title: new FormControl(this.place.title, {
            updateOn: 'change',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.descriptipon, {
            updateOn: 'change',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        })
      })
    })
  }

  ngOnDestroy(){
    if (this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

  
  onEditOffer(){
    if (!this.form.valid) return; 
    console.log(this.form.value)
  }
}
 
