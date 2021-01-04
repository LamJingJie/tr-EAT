import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-viewaccount',
  templateUrl: './viewaccount.page.html',
  styleUrls: ['./viewaccount.page.scss'],
})
export class ViewaccountPage implements OnInit {
  userSubscription: Subscription;
  userData: any = [];
  currentRole: string;
  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController) {
      this.currentRole = 'vendor';

    this.userSubscription = this.userService.getAll(this.currentRole).subscribe((data) => {this.userData = data;});
   }

  ngOnInit() {
  }

  changeRole(role){
    console.log(role.detail.value);
    this.currentRole = role.detail.value;
    this.userSubscription = this.userService.getAll(this.currentRole).subscribe((data) => {this.userData = data;});
  }

  dismiss(){
    this.navCtrl.pop();
  }

  ngOnDestroy(){
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

}
