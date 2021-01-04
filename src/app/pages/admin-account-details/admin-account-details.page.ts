import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-account-details',
  templateUrl: './admin-account-details.page.html',
  styleUrls: ['./admin-account-details.page.scss'],
})
export class AdminAccountDetailsPage implements OnInit {
  currentAccount: string;
  userDetailsSubscription: Subscription;
  userDetails: any = [];

  constructor(private activatedRoute: ActivatedRoute, private navCtrl:NavController, private userService: UserService) {

    
   }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    let account = this.activatedRoute.snapshot.paramMap.get('account');
    this.currentAccount = account;
    console.log(account);
    
  }

  ionViewDidEnter(){
    this.userDetailsSubscription = this.userService.getAll(this.currentAccount).subscribe((data) => {this.userDetails = data;});
  }

  dismiss(){
    this.navCtrl.pop();
  }

  ngOnDestroy(){
    if(this.userDetailsSubscription){
      this.userDetailsSubscription.unsubscribe();
    }
  }

}
