import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular'; 
import { Router } from '@angular/router';
import {CanteenService} from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  currentAccount: any;
  currentRole: any;

  stamps: any; //Student

  customBackBtnSubscription: Subscription;

  userSub: Subscription;


  constructor(private platform: Platform, private router: Router, private alertCtrl: AlertController, 
    private authService: AuthenticationService, private storage: Storage, private userService: UserService) {}

  ngOnInit(){
    this.storage.get('email').then(res =>{
      this.currentAccount = res;
      // console.log("Email tabs: " + res);
      //alert("Email tabs: " + res);
    });

    this.storage.get('role').then(res =>{
      this.currentRole = res;
      // console.log("Email tabs: " + res);
      //alert("Email tabs: " + res);
      if(this.currentRole === 'student'){
        this.userSub = this.userService.getOne(this.currentRole).subscribe((res=>{
          this.stamps = res['stampLeft'];

          this.userSub.unsubscribe();
        }))
      }
    });
  }


  ionViewWillEnter(){
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }

    
  }

  SignOut(){
    this.authService.SignOut();
  }

  ionViewWillLeave(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
  }

  async leavePopup(){
    
    const alert1 = await this.alertCtrl.create({
      message: 'Close the application?',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
            navigator['app'].exitApp();
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });

    await alert1.present();
  }

  ngOnDestroy(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 

    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
  
 

}
