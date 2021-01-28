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
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { HistoryService } from 'src/app/services/history/history.service';
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';
import { ModalVerifychckoutPage } from 'src/app/Modal/modal-verifychckout/modal-verifychckout.page';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  customBackBtnSubscription: Subscription;
  cartSubscription: Subscription;
  receiptSubscription: Subscription;
  orderSubscription: Subscription;
  getStallNameSubscription: Subscription;
  canteenSub: Subscription;

  //vendor
  vendorOrderSub: Subscription;
  vendorOrderArray: any[] = [];

  foodSub: Subscription;
  userRole: any;
  userEmail: any;

  cartArray: any[] = [];

  foodArray: any[] = [];

  totalPriceAll: number;

  paymentMethod: any;

  disabled:boolean;

  receiptData: any = [];

  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private historyService: HistoryService, private canteenService: CanteenService ) {
      this.paymentMethod = 'PAYNOW';
    }

  ngOnInit(){
    
    

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
      this.calculate_total_price();
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


  async ionViewWillEnter(){

    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');
    //console.log(this.userRole)

    if(this.userRole === 'sponsor'){
      this.getCart().then(res=>{
        this.calculate_total_price();
      });
    }
   
   
    if(this.userRole === 'student'){
      this.getReceipt();
    }

    if(this.userRole === 'vendor'){
      this.getOrders();
    }
    

    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }

    this.disabled = true; //Disable the purchase btn to give time to load total cost
    setTimeout(()=>{
      this.disabled = false; //Enable the purchase btn
      
    },1500)


  }

  //For vendors, retrieve latest orders
  getOrders(){
    this.vendorOrderSub = this.orderService.getAllForVendor(this.userEmail, false).subscribe((res=>{
      this.vendorOrderArray = res;
      //console.log(res);
    }))
  }


  //For students that redeemed a food
  getReceipt(){
    this.receiptSubscription = this.userService.getOne(this.userEmail).subscribe((res=>{
      this.receiptData = res;
      if(this.receiptData.orderid !== ""){

        //Get foodname and date of order
        this.orderSubscription = this.orderService.getOneOrder(this.receiptData.orderid).subscribe((res=>{
          this.receiptData.foodname = res['foodname'];
          this.receiptData.date = res['date'];

          //Get stall name
          this.getStallNameSubscription = this.userService.getOne(res['vendorID']).subscribe((res=>{
            this.receiptData.stallname = res['stallname'];
     
          }))

          //Get canteen name
          this.canteenSub = this.canteenService.getCanteenbyid(res['canteenID']).subscribe((res=>{
            this.receiptData.canteenname = res['canteenname'];
          }))

        }))
      }else{
        //console.log("Empty orderid");
      }
     
     // console.log(this.receiptData);
 
    }))
  }

  getCart(){
    return new Promise((resolve, reject) =>{
      this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res=>{
        this.cartArray = res;
       
        resolve(this.cartArray);
      }))
    });
    
  }

  calculate_total_price(){
      this.totalPriceAll = 0;
      
     // console.log("cart")
      this.cartArray.forEach((resEach,index)=>{
       // console.log("loop")
        //Calculate total food price
        this.foodSub = this.foodService.getFoodById(resEach.id).pipe(first()).subscribe((resFood=>{
          
          this.cartArray[index].price = resFood['foodprice'];
          this.cartArray[index].totalfoodprice = resFood['foodprice'] * resEach['orderquantity'];
          this.cartArray[index].foodname = resFood['foodname'];
          this.totalPriceAll += resEach['orderquantity'] * this.cartArray[index].price;
          //console.log(this.totalPriceAll);
  
          
        }))
      
      })

     // console.log(this.cartArray);
      
      //this.cartSubscription.unsubscribe();
  }

  async collected(){
    const alert2 = await this.alertCtrl.create({
      header: 'Confirm Collection?',
      message: 'changes is irrevisible',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
           //console.log("Yes")
           //console.log(this.receiptData.orderid);
           //Remove orderid from user db to empty string
           this.userService.updateOrderId(this.userEmail, "");
           this.orderService.updateComplete(this.receiptData.orderid);
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
    if(this.getStallNameSubscription){
      this.getStallNameSubscription.unsubscribe();
    }
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.receiptSubscription){
      this.receiptSubscription.unsubscribe();
    }
    if(this.vendorOrderSub){
      this.vendorOrderSub.unsubscribe();
    }
    if(this.canteenSub){
      this.canteenSub.unsubscribe();
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
