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
import { HistoryService } from 'src/app/services/history/history.service';
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';
import { ModalVerifychckoutPage } from 'src/app/Modal/modal-verifychckout/modal-verifychckout.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  customBackBtnSubscription: Subscription;
  cartSubscription: Subscription;
  foodSub: Subscription;
  userRole: any;
  userEmail: any;

  cartArray: any[] = [];

  foodArray: any[] = [];

  totalPriceAll: number;

  paymentMethod: any;

  disabled:boolean;

  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private historyService: HistoryService ) {
      this.paymentMethod = 'PAYNOW';
    }

  ngOnInit(){
    

   console.log("Ngoninit")
    

  }


  async proceedPayment(){
    const modal = await this.modalCtrl.create({
      component: ModalVerifychckoutPage,
      cssClass: 'modal_verifychckout_class',
      componentProps:{
        cart: this.cartArray,
        total: this.totalPriceAll,
        paymentmethod: this.paymentMethod,
        user: this.userEmail
      }
    });
    await modal.present();

    await modal.onWillDismiss().then((res=>{
      this.run_everytime();
    }));
    
  

  }

  changePaymentMtd(event){
    this.paymentMethod = event;
  }

  increaseAmt(quantity, cartid){
    //console.log(quantity);
    quantity = quantity + 1;
    this.cartService.updateQuantity(this.userEmail, quantity, cartid).then((res=>{
      this.calculate_total_price();
    }));
  }

  decreaseAmt(quantity, cartid){
    //console.log(quantity);
    if(quantity > 1){
      //console.log(">1");
      quantity = quantity -1;
      this.cartService.updateQuantity(this.userEmail, quantity, cartid).then((res=>{
        this.calculate_total_price();
      }));
    }else{
      //console.log("<1");
      this.quantityRemove(cartid);
    }
  }


  ionViewWillEnter(){
   

    this.disabled = true; //Disable the purchase btn to give time to load total cost
    setTimeout(()=>{
      this.disabled = false; //Enable the purchase btn
      
    },1500)
   
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
    this.run_everytime();
   

  }

  run_everytime(){
    this.storage.get('email').then(res=>{
      //console.log("role: " + res);
      this.userEmail = res;
      this.calculate_total_price();

    });

    console.log("will enter")
    this.storage.get('role').then(res=>{
      //console.log("role: " + res);
      this.userRole = res;
      
    });
  }

  calculate_total_price(){
   
    this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res=>{
      this.totalPriceAll = 0;
      this.cartArray = res;
    
      this.cartArray.forEach((resEach,index)=>{
        
        //Calculate total food price
        this.foodSub = this.foodService.getFoodById(resEach.id).pipe(first()).subscribe((resFood=>{
          
          this.cartArray[index].price = resFood['foodprice'];
          this.totalPriceAll += resEach['orderquantity'] * this.cartArray[index].price;
          console.log(this.totalPriceAll);
  
          
        }))
      
      })
      
      
      this.cartSubscription.unsubscribe();
      
    }))
    
  }

  async quantityRemove(cartid){
    
    const alert2 = await this.alertCtrl.create({
      message: 'Remove this food from cart?',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
           this.cartService.deleteSpecificFoodInCart(this.userEmail, cartid).then((res=>{
             //console.log("Food Removed!");
             this.calculate_total_price();
             
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
    if(this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
    
  }
  ngOnDestroy(){
    console.log("Destroy");
  }

  
 

}
