import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsLogedIn: boolean = false;

  get userIsLogedIn(){
    return this._userIsLogedIn;
  }
  constructor() { }

  login(){
    this._userIsLogedIn = true
    }
    
    logout(){
      this._userIsLogedIn = false
      }

}
