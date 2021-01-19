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
import { ModalController, PickerController } from '@ionic/angular';
import { FoodService } from 'src/app/services/food/food.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'

@Component({
  selector: 'app-foodlist',
  templateUrl: './foodlist.page.html',
  styleUrls: ['./foodlist.page.scss'],
})
export class FoodlistPage implements OnInit {
foodSubscription: Subscription;
getfoodSubscription: Subscription;
filterfoodSubscription: Subscription;

vendor: any;
stall: any;
canteen: any;
foodlistArray: any = [];

chosenFilter: any;

userRole : any;
userEmail: any;

count: any;
currentAmt: any;
keysArray: any[] = [];
valueArray: any[] = [];
combineArray: any[] = [];


foodM = new Map();

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController, private storage: Storage, private cartService: CartService) {

      this.chosenFilter = 'all'
      this.count = 1;
      this.currentAmt = 1;
      
     }

  ngOnInit() {

    this.foodSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.stall = params.stall;
      this.vendor = params.vendor;
      this.canteen = params.canteenid;
      //console.log(this.stall);
      //console.log(this.vendor);
      this.filterFood(this.chosenFilter);
     
    });
  }

  ionViewWillEnter(){
    this.storage.get('role').then(res=>{
      //console.log("role: " + res);
      this.userRole = res;
      
    });
    this.storage.get('email').then(res=>{
      //console.log("email: " + res);
      this.userEmail = res;
      
    });
  }

  addAmt(foodid){
   // console.log(foodid);
    var amt = this.foodM.get(foodid);
    amt = amt + 1;
    //console.log(this.currentAmt);
    this.foodM.set(foodid, amt);
    //console.log(this.foodM.entries());
    this.getKeys();
  }

  deductAmt(foodid){
    //console.log(foodid);
    var amt = this.foodM.get(foodid);
    if(amt > 1){
      amt = amt - 1;
      //console.log(this.currentAmt);
      this.foodM.set(foodid, amt);
      //console.log(this.foodM.entries());
      this.getKeys();
    }
   
  }

  //Sponsor
  CartFood(foodid, foodname){
    //Add data into cart 
    var foodname123 = foodname;
    var amountOrdered = this.foodM.get(foodid);
    //console.log(amountOrdered);
    this.cartService.addToCart(foodid, this.userEmail, this.canteen, amountOrdered, foodname).then((res=>{
      this.CartshowSuccess(foodname123);
    })).catch((err=>{
      this.showError(err);
    }))
  }

  //Student
  async RedeemFood(id, quantity, foodname, foodprice, image, vendorid){
    //Show alert box
    const alert1 = await this.alertCtrl.create({
      header: 'Confirmation of Redemption',
      message: 'Are you sure you would like to redeem the following item' + '<br><br><br><br>' + '1x ' + foodname + "  $"+foodprice,
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
            //Use 'vendorid' param to retrieve respective canteenID from 'users' database
            if(quantity < 1){
              alert('"' + foodname + '"' + " is currently unavailable. Please redeem another food");
            }else{
              quantity = quantity - 1; //Deduct per redeem
              console.log(quantity);
               //this.foodService.redeemFood(id, quantity);
            }
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


  async CartshowSuccess(foodname){
    const toast = await this.toast.create({message: '"' + foodname + '"' + ' has been added to cart.', position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async RedeemshowSuccess(foodname){
    const toast = await this.toast.create({message: '"' + foodname + '"' + ' has been successfully redeemed! You have to collect it before you can make your next redeem.', position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  //Get food based on which filter user chose
  filterFood(filter){
    //console.log(filter);
    this.filterfoodSubscription = this.foodService.getFoodBasedOnStallNFilter(this.vendor, filter).subscribe((res =>{

      this.foodlistArray = res;
     // console.log(this.foodlistArray);
      res.forEach((res=>{
        //console.log(res.id);
        this.foodM.set(res.id, this.count); //Store each food with count = 1
        
      }))
      this.getKeys();

      //console.log(this.foodM.entries());
      this.filterfoodSubscription.unsubscribe();
    }))
  }

  getKeys(){
    let keys = Array.from(this.foodM.keys());
    let values = Array.from(this.foodM.values());
    this.keysArray = keys;
    this.valueArray = values;
  }

  //Filter button
  async filter(ev){
    const popover = await this.popoverCtrl.create({
      component: FoodfilterComponent,
      event: ev,
      translucent: true,
      componentProps:{chosenFilter: this.chosenFilter},
      cssClass: 'filter-popover'
      
    });

    //Store the data user clicked on the popover and run a filtering function 
   popover.onDidDismiss().then((res =>{
     
    //console.log(res.data.title);
    this.chosenFilter = res.data.title;
    this.filterFood(this.chosenFilter);
    
   })).catch((err=>{
     //If user did not select anything and clicked on the outside
     //console.log(err);
   }))

    return await popover.present();

  }
  
  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  dismiss(){
    this.navCtrl.back();
  }


  ngOnDestroy(){
    if(this.foodSubscription){
      this.foodSubscription.unsubscribe();
    }
    if(this.filterfoodSubscription){
      this.filterfoodSubscription.unsubscribe();
    }
    if(this.getfoodSubscription){
      this.getfoodSubscription.unsubscribe();
    }
  }

}
