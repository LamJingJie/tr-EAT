import { Component, Input, OnInit } from '@angular/core';
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
import { HistoryService} from 'src/app/services/history/history.service';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';

@Component({
  selector: 'app-modal-verifychckout',
  templateUrl: './modal-verifychckout.page.html',
  styleUrls: ['./modal-verifychckout.page.scss'],
})
export class ModalVerifychckoutPage implements OnInit {
  @Input() cart: any[] = [];
  @Input() total: any;
  @Input() paymentmethod: string;
  @Input() user: any;

  foodSub: Subscription;
  foodSub2: Subscription;

  canteenSub: Subscription;

  pay_foodSub: Subscription;

  totalPriceAll: number;
  
  
  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private loading: LoadingController, private historyService: HistoryService,
    private canteenService: CanteenService, private appLauncher: AppLauncher, private market: Market, private appAvail: AppAvailability) { 

    }

  ngOnInit() {
   

  
  }

  ionViewWillEnter(){
    
    this.totalPriceAll = 0;
    this.cart.forEach((res,index)=>{
      
     //Get data so that if there's any changes to the db, the user will see it here as the cart page doesn't automatically update
      this.foodSub = this.foodService.getFoodById(res['id']).pipe(first()).subscribe((foodres=>{
        this.cart[index].foodname = foodres['foodname']; //store foodname
        this.cart[index].individualfoodPrice = foodres['foodprice'] * res['orderquantity']; //total price for individual food
        this.cart[index].image = foodres['image'];
        this.totalPriceAll += res['orderquantity'] * foodres['foodprice'];
      }))
      
    })
    //console.log(this.cart);

    setTimeout(()=>{
      this.dismiss();
    }, 20000) //20 seconds
  }

  async pay(){

  
   //console.log(this.cart)
   var todayDate: Date = new Date();
   let app;

   //Open app on android phone for paynow 
   const options: AppLauncherOptions={
    
   }
   if (this.platform.is('android')) {
     if(this.paymentmethod === "PAYLAH"){
        app = 'com.dbs.dbspaylah';
        options.packageName = 'com.dbs.dbspaylah'
     }
     if(this.paymentmethod === "PAYNOW"){
        app = 'com.ocbc.mobile';
        options.uri = 'fb://profile'
     } 
  }
  
  this.appAvail.check(app)
    .then(

      //Available
      (yes: boolean) => {
        alert(app + ' is available')
        this.appLauncher.canLaunch(options).then((launched: Boolean)=>{
          if(launched){
            this.appLauncher.launch(options);
          }else{
            alert('Unable to open')
            this.market.open(app); //Open app store 
          }
        }).catch((err)=>{
          alert("Error: " + err);
        })
      },

      //Unavailable
      (no: boolean) => {
        alert(app + ' is NOT available')
        this.market.open(app);//Open app store
      }
    );
   /*this.appLauncher.canLaunch(options).then((launched: Boolean)=>{
     if(launched){
       this.appLauncher.launch(options).then(()=>{
         alert("Opened!");
       }).catch((err)=>{
         alert(JSON.stringify(err));
         this.market.open(options.toString());
       })
     }else{
       alert("Unable to open")
       this.market.open(options.toString());
     }
   }).catch((err=>{
     alert(JSON.stringify(err));
     this.market.open(options.toString());
   }))*/
   
   /*await this.presentLoadingPay();
    var totalquantity = 0;
    this.cart.forEach((res, index)=>{
      //console.log(res['id']);
      //Get latest data for availquantity
      this.foodService.getFoodById(res['id']).pipe(first()).subscribe((foodres=>{
        //console.log(foodres);

        totalquantity = foodres['availquantity'] + res['orderquantity'];
        //console.log(totalquantity);
        //1. Add orderquantity to respective food
        this.foodService.updateAvailQuantity(res.id, totalquantity);

        //2. Add cart data into history db, date will be the same for all food in a cart.
        this.historyService.transfer_cart_to_history(this.user, todayDate, res['canteenid'], res.id, res['foodname'],
        res['price'], res['image'], res['orderquantity'], res['userid'], res['individualfoodPrice']);  
      }))
  
         
    })
    //3. Delete all carts data
    await this.cartService.deleteCart(this.user);
    
    this.loading.dismiss(null,null,'pay'); 
  
    this.dismiss();*/
    
  }

  async presentLoadingPay(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Paying...',
      id: 'pay'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  ionViewWillLeave(){
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
    if(this.foodSub2){
      this.foodSub2.unsubscribe();
    }
    if(this.canteenSub){
      this.canteenSub.unsubscribe();
    }
  }
  ngOnDestroy(){
   
  }

}
