import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsLogedIn: boolean = true;
  private _userId = '222'
   

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
