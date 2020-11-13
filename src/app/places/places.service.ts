import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.mode';
import { take, map, tap, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
  [
    new Place(
      '1',
      'Japan nature',
      'Some silly description for dummy data for now...',
      'https://www.planetware.com/wpimages/2019/10/asia-best-places-to-visit-mount-fuji-japan.jpg',
      100,
      new Date('2020-01-01'),
      new Date('2020-01-15'),
      '111'
    ), 
    new Place(
      '2',
      'Look at this! ',
      'Some silly description for dummy data for now...',
      'https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg',
      200,
      new Date('2020-10-01'),
      new Date('2020-10-15'),
      '222'
    )
  ]
  );
  

  get places(){
    return this._places.asObservable()
  }

  constructor(private authService: AuthService) { }

  getPlace(id:string){
    return this.places.pipe(take(1),
    map(places => {
      return {...places.find(p => p.id === id)}
    })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date 
  ) {
    const newPlace = new Place(
      Math.random().toString(), 
      title, 
      description,
      'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&w=1000&q=80',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
      );
      return this.places.pipe(take(1), delay(1000), tap( places => {
          this._places.next(places.concat(newPlace)); 
      })
    );
  }
}
