import { Injectable } from '@angular/core';
import { Place } from './place.mode'

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      '1',
      'Japan nature',
      'Some silly description for dummy data for now...',
      'https://www.planetware.com/wpimages/2019/10/asia-best-places-to-visit-mount-fuji-japan.jpg',
      100,
      new Date('2020-01-01'),
      new Date('2020-01-15')
    ), 
    new Place(
      '2',
      'Look at this! ',
      'Some silly description for dummy data for now...',
      'https://assets.traveltriangle.com/blog/wp-content/uploads/2016/07/limestone-rock-phang-nga-1-Beautiful-limestone-rock-in-the-ocean.jpg',
      200,
      new Date('2020-10-01'),
      new Date('2020-10-15')
    )
  ];

  get places(){
    return [...this._places]
  }

  constructor() { }

  getPlace(id:string){
    return {...this._places.find(p => p.id === id)}
  }
}
