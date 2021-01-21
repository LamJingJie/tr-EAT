import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import {OrderService } from 'src/app/services/order/order.service';
import { rejects } from 'assert';
import { KeyValuePipe } from '@angular/common';
import { CartTotalCostPipe } from 'src/app/pages/foodlist/cart-total-cost.pipe';
import { ModalController, PickerController } from '@ionic/angular';
import { FoodService } from 'src/app/services/food/food.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  customBackBtnSubscription: Subscription;
  cartSubscription: Subscription;
  userRole: any;
  userEmail: any;

  cartArray: any[] = [];

  foodArray: any[] = [];
  cartM = new Map();

  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, ) {}

  ngOnInit(){
    this.storage.get('email').then(res=>{
      //console.log("role: " + res);
      this.userEmail = res;
      
      this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res=>{
        var count = 0;

        this.cartArray = res;

        res.forEach((res=>{
          this.cartM.set(res.id, count)
          count = count + 1;
        }))

        
      }))
      
    });

    this.storage.get('role').then(res=>{
      //console.log("role: " + res);
      this.userRole = res;
      
    });
  }

  increaseAmt(quantity, cartid){
    //console.log(quantity);
    quantity = quantity + 1;
    this.cartService.updateQuantity(this.userEmail, quantity, cartid);
  }

  decreaseAmt(quantity, cartid){
    console.log(quantity);
    if(quantity > 1){
      //console.log(">1");
      quantity = quantity -1;
      this.cartService.updateQuantity(this.userEmail, quantity, cartid);
    }else{
      //console.log("<1");
      this.quantityRemove(cartid);
    }
  }


  ionViewWillEnter(){
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
  }

  async quantityRemove(cartid){
    
    const alert2 = await this.alertCtrl.create({
      message: 'Remove this food from cart?',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
           this.cartService.deleteSpecificFoodInCart(this.userEmail, cartid).then((res=>{
             console.log("Food Removed!");
           }))
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });

    await alert2.present();
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

  ionViewWillLeave(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
  }
  ngOnDestroy(){
    if(this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
  }

  
 

}
