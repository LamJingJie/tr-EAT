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
import { OrderService } from 'src/app/services/order/order.service';
import { first } from 'rxjs/operators';


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
  orderSubscription: Subscription;
  userSub: Subscription;
  canteenSubscription: Subscription;

  orderArray: any[] = [];
  top5_orderArray: any[] = [];

  sliderConfigx={
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 1.5,
    roundLengths: true
  }


  constructor(private platform: Platform, private router: Router, private alertCtrl: AlertController, 
    private authService: AuthenticationService, private storage: Storage, private userService: UserService,
    private orderService: OrderService, private canteenService: CanteenService) {}

  ngOnInit(){
  
  }
  async ionViewWillEnter(){
    this.currentAccount = await this.storage.get('email')

    this.currentRole =  await this.storage.get('role');

    if(this.currentRole === 'student'){
      this.getStamps();
    }

    if(this.currentRole ==='vendor'){
      this.getLatest5Order();
    }
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
  }    


  getStamps(){
    this.userSub = this.userService.getOne(this.currentAccount).subscribe((res=>{
      this.stamps = res['stampLeft'];
      //console.log(res);

      this.userSub.unsubscribe();
    }))
  }

  //Get orders that hasn't been completed yet
  getLatest5Order(){
    this.orderSubscription = this.orderService.getLast5Orders(this.currentAccount, false).subscribe((res=>{
      this.orderArray = res;
      this.orderArray.forEach((res, index)=>{
        //Get canteen color and canteen name
        this.canteenSubscription=this.canteenService.getCanteenbyid(res['canteenID']).pipe(first()).subscribe((canteen_res=>{
          this.orderArray[index].canteencolor = canteen_res['color'];
          this.orderArray[index].canteenname = canteen_res['canteenname'];
        }))

      })
      console.log(this.orderArray)
     /* if(this.orderArray.length >= 5){
        var top5 = this.orderArray.length - 5;
        console.log(top5);
        this.top5_orderArray = this.orderArray.slice(top5, this.orderArray.length); //Get the top 5 only and display 
      }else{
        this.top5_orderArray = this.orderArray;
      }*/
    
      //console.log(this.top5_orderArray);
    }))
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
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.canteenSubscription){
      this.canteenSubscription.unsubscribe();
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
