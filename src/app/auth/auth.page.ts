import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading: boolean = false;
  isLogin: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl.create({
      keyboardClose: true,
      message:'Logging in...'
    })
    .then(loadingEl => {
      // open our loading controller
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover')
      }, 1500)
    })
  }

  onSubmit(form: NgForm){
    if (!form.valid) return; 
    const email = form.value.email;
    const password = form.value.password

    if (this.isLogin) {
      // req to login server
    }
    else{
      //req to signup servers
    }
  }

  onSwitchMode(){
    this.isLogin = !this.isLogin
  }

}
