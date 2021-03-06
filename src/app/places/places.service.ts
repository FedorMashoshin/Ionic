import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.mode';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData{
  dateFrom: string;
  dateTo: string;
  description: string;
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
              res[key].description,
              res[key].image,
              res[key].price,
              new Date(res[key].dateFrom),
              new Date(res[key].dateTo),
              res[key].userId
            )
          );
        }
      }
      return places;
    }),
    tap( places => {
      this._places.next(places)
    })
  )
  }

  getPlace(id:string){
    // get one place from db
    return this.http.get<PlaceData>(
      `https://ionic-project-9efe5.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id, 
            placeData.title,
            placeData.description,
            placeData.image,
            placeData.price,
            new Date(placeData.dateFrom),
            new Date(placeData.dateTo),
            placeData.userId
          );
        })
      )
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
  }

  updateOffer(placeId: string, title: string, description: string){
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0){
          return this.fetchData();
        } else {
          return of(places);
        }
      }),
        switchMap(places => {
          const updatedPlacesIndex = places.findIndex( pl => pl.id === placeId );
          updatedPlaces = [...places];
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
          return this.http.put(
            `https://ionic-project-9efe5.firebaseio.com/offered-places/${placeId}.json`,
            {...updatedPlaces[updatedPlacesIndex], id:null}
          );
        }),
        tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
