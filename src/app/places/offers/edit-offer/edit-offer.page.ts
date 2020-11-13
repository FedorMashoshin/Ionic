import { Place } from './../../place.mode';
import { PlacesPageRoutingModule } from './../../places-routing.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
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
private placesSub: Subscription;

form: FormGroup; 
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
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
    this.loadingCtrl.create({
      message: 'Your offer is editing...'
    }).then((loadingEl) => {
      loadingEl.present();
      this.placesService.updateOffer(
        this.place.id,
        this.form.value.title,
        this.form.value.description
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offers')
        });
    })
  }
}
 
