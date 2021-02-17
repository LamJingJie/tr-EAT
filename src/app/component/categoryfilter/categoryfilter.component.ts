import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, NavParams, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

//Services Imports 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

//Database Imports
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categoryfilter',
  templateUrl: './categoryfilter.component.html',
  styleUrls: ['./categoryfilter.component.scss'],
})


@NgModule({
  imports: [CommonModule],
  declarations: [CategoryfilterComponent]
})

export class CategoryfilterComponent implements OnInit {
  filter: any;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private navParams: NavParams,
    private popoverCtrl: PopoverController) {
    this.filter = this.navParams.get('chosenFilter');
  }

  ngOnInit() {
  }

  //Select Function in Category Page
  selectFilter(filter) {
    let data = {
      title: filter
    };
    this.popoverClose(data);
  }

  popoverClose(data) {
    this.popoverCtrl.dismiss(data);
  }

}