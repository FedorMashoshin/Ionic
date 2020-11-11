import { Place } from '../place.mode';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
 loadedPlaces: Place[];
 private placesSub: Subscription;
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      // this.loadedPlaces = this.loadedPlaces.slice(1)
  });

}
  ngOnDestroy(){
    if (this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail)  
  }

}
