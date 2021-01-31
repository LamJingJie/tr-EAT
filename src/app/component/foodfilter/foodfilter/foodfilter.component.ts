import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController, NavController, NavParams, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-foodfilter',
  templateUrl: './foodfilter.component.html',
  styleUrls: ['./foodfilter.component.scss'],
})

@NgModule({
  imports: [CommonModule],
  declarations: [FoodfilterComponent]
})

export class FoodfilterComponent implements OnInit {

  filter: any;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController, private navParams: NavParams,
    private popoverCtrl: PopoverController) {
      this.filter = this.navParams.get('chosenFilter');
     }

  ngOnInit() {
    console.log("test")
  }

  selectFilter(filter){
    //console.log(filter);
    let data = {
      title: filter
    };
    this.popoverClose(data);
  }

  popoverClose(data){
    this.popoverCtrl.dismiss(data);
  }

}
