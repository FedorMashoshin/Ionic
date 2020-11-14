import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.mode';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData{
  dateFrom: string;
  dateTo: string;
  descriptipon: string;
  image: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  generatedId: string;
  private _places = new BehaviorSubject<Place[]>([]);
  

  get places(){
    return this._places.asObservable()
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  fetchData(){
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-project-9efe5.firebaseio.com/offered-places.json')
    .pipe(map(res => {
      const places = [];
      for (const key in res){
        if (res.hasOwnProperty(key)) {
          places.push(
            new Place(
              key, 
              res[key].title,
              res[key].descriptipon,
              res[key].image,
              res[key].price,
              new Date(res[key].dateFrom),
              new Date(res[key].dateTo),
              res[key].userId
            )
          );
        }
      }
      // return places;
      return [];
    }),
    tap( places => {
      this._places.next(places)
    })
  )
  }

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
      return this.http.post<{ name: string }>('https://ionic-project-9efe5.firebaseio.com/offered-places.json', 
      { ...newPlace, id: null})
      .pipe(
        switchMap(res => {
          this.generatedId = res.name;
          return this.places
        }),
        take(1), 
        tap( places => {
          newPlace.id = this.generatedId
          this._places.next(places.concat(newPlace)); 
        })
      );
      return this.places.pipe(
       
        delay(1000), 
        
       );
  }

  updateOffer(placeId: string, title: string, description: string){
    return this.places.pipe(
      take(1),
      delay(1000),
      tap( places => {
        const updatedPlacesIndex = places.findIndex( pl => pl.id === placeId );
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlacesIndex]
        updatedPlaces[updatedPlacesIndex] = new Place(
          oldPlace.id, 
          title, 
          description, 
          oldPlace.image, 
          oldPlace.price,
          oldPlace.dateFrom, 
          oldPlace.dateTo,
          oldPlace.userId);
          this._places.next(updatedPlaces);
      }));
  }
}
