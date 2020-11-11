import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsLogedIn: boolean = false;
  private _userId = '111'
   

  get userIsLogedIn(){
    return this._userIsLogedIn;
  }

  get userId(){
    return this._userId;
  }
  constructor() { }

  login(){
    this._userIsLogedIn = true
    }
    
  logout(){
    this._userIsLogedIn = false
    }

}
