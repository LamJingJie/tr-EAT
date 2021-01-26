import { Component } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular'; 
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
import { FoodService  } from 'src/app/services/food/food.service';
import { first } from 'rxjs/operators';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

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
  userSub2: Subscription;
  foodSub:Subscription;

  orderArray: any[] = [];
  //top5_orderArray: any[] = [];
  foodArray: any[] = [];


  constructor(private platform: Platform, private router: Router, private alertCtrl: AlertController, 
    private authService: AuthenticationService, private storage: Storage, private userService: UserService,
    private orderService: OrderService, private canteenService: CanteenService, private foodService: FoodService, private modalCtrl: ModalController) {}

  ngOnInit(){
  
  }


  async ionViewWillEnter(){
    this.currentAccount = await this.storage.get('email')

    this.currentRole =  await this.storage.get('role');

    if(this.currentRole === 'student'){
      this.getStamps();
    }
    if(this.currentRole ==='vendor'){
      this.getVendorFood();
    }

    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }

    
  }

  async aboutus_modal(){
    //Unsubscribe back btn
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    }

    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();

    await modal.onWillDismiss().then(res=>{
      //Resubscribes back btn
      if (this.platform.is('android')) { 
        this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
          this.leavePopup();
        });
      }
    })

  }

  getStamps(){
    this.userSub = this.userService.getOne(this.currentAccount).subscribe((res=>{
      this.stamps = res['stampLeft'];
      //console.log(res);

      this.userSub.unsubscribe();
    }))
  }

  getVendorFood(){
    this.foodSub = this.foodService.getFoodBasedOnStall(this.currentAccount).subscribe((res=>{
      this.foodArray= res;
      //console.log(this.foodArray);
      this.foodArray.forEach((val, index)=>{
        //Get canteen id
        this.userSub2 = this.userService.getOne(this.currentAccount).subscribe((userres=>{
          var canteenid = userres['canteenID'];
          //Get canteen name and color
          this.canteenSubscription = this.canteenService.getCanteenbyid(canteenid).subscribe((canteenres=>{
            this.foodArray[index].canteenname = canteenres['canteenname'];
            this.foodArray[index].canteencolor = canteenres['color'];
          }))
        }))
      })
    }))

    //console.log(this.foodArray);
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
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
    if(this.userSub2){
      this.userSub2.unsubscribe();
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
