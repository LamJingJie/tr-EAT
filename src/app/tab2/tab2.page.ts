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
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AngularFirestore } from '@angular/fire/firestore';

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

  historySub:Subscription;

  getPaidBoolean: Subscription;
  paid: boolean = false;

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
  bankChosen: any;

  disabled:boolean;

  receiptData: any = [];

  historyData: any[] = [];
  totalcostall: number;

  today: Date;

  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private historyService: HistoryService, private canteenService: CanteenService,
    private clipboard: Clipboard, private loading: LoadingController, private firestore: AngularFirestore,) {
      this.paymentMethod = 'OCBC';
  
    }

  async ngOnInit(){
    
    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');
    //console.log(this.userRole)

    if(this.userRole === 'student'){
      this.getReceipt();
    }

    if(this.userRole === 'vendor'){
      this.getOrders();
    }

  }

  copy(number: string){
    //console.log(number);
    this.clipboard.copy(number).then(()=>{
      this.showClipboardMsg();
    }).catch((err)=>{
      this.showError(err);
    });
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
      this.checkIfPaid();
      this.getPending();
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
      })).catch((res =>{
        this.showError(res);
      }));
 
   
  }

  decreaseAmt(quantity, cartid){
    //console.log(quantity);
  

      if(quantity > 1){
        //console.log(">1");
        quantity = quantity -1;
        this.cartService.updateQuantity(this.userEmail, quantity, cartid).then((res=>{
          this.calculate_total_price();
        })).catch((res=>{
          this.showError(res);
        }));
      }else{
        //console.log("<1");
        this.quantityRemove(cartid);
      }
  
    
  }


  async ionViewWillEnter(){
    
    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');

    if(this.userRole === 'sponsor'){
      this.getCart().then(res=>{
        this.calculate_total_price();
      }).catch((res=>{
        this.showError(res);
      }));
      this.checkIfPaid().then((res=>{
        if(res === true){
          this.getPending();
        }
      })).catch((res=>{
        this.showError(res);
      }));
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
      //console.log(res);
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
     
      //console.log(this.receiptData);
 
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

  //Check if sponsor has paid
  checkIfPaid(){
    return new Promise((resolve, reject)=>{
      this.getPaidBoolean = this.userService.getOne(this.userEmail).subscribe((res =>{
        this.paid = res['paid'];
        //console.log(this.paid);
        resolve(this.paid);
      }))
    })
   
  }

  //Get history that is waiting to be confirmed as paid for sponsors
  getPending(){
    this.totalcostall = 0;
    this.historySub = this.historyService.getSponsorHistory(this.userEmail, false).subscribe((res=>{
      this.historyData = res;
      this.historyData.forEach((val, index)=>{
        this.totalcostall = this.totalcostall + val['totalcost'];
      })

      this.historySub.unsubscribe();
    }))
  }

  /*
  async paymentMade(){
    const alert2 = await this.alertCtrl.create({
      header: 'Payment Confirmation',
      message: 'changes is irrevisible',
      buttons:[
        {
          text: 'Yes',
          handler:async ()=>{
            var todayDate: Date = new Date();
            await this.presentLoadingConfirm();
            this.userService.updatePaid(this.userEmail, false);

            //Get history that isn't paid 
            this.historyService.getHistoryNotPaid(this.userEmail).pipe(first()).subscribe((resArray=>{
              //console.log(resArray);
              var totalquantity = 0;
              resArray.forEach((res, index)=>{
                //console.log(res['id'])
                //console.log(this.userEmail);
                this.historyService.updateHistoryDate(this.userEmail, res['id'], todayDate);
                this.historyService.updateConfirmPay(this.userEmail, res['id']);  
                
                //Get latest data for availquantity
                //check if food has been deleted by admin
                var foodDoc = this.firestore.collection('food').doc(res['foodid']);           
                foodDoc.get().toPromise().then(foodDoc =>{                   
                  if(foodDoc.exists){
                    totalquantity = foodDoc.get('availquantity') + res['orderquantity'];
                    //console.log(totalquantity);
                    //Add orderquantity to respective food
                    this.foodService.updateAvailQuantity(res['foodid'], totalquantity);            
                  }
                })
              })
            }))
           
            this.loading.dismiss(null,null,'cpay');
            this.ionViewWillLeave() //unsubscribe so won't cause any issues when page refresh
            this.ionViewWillEnter() //refresh page
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: async ()=>{
            console.log("no");
          }
        }
      ]
    });

    await alert2.present();

   
  }
  */

  async presentLoadingConfirm(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message:'Confirming Payment...',
      id: 'cpay'
    });
    await loading3.present();

    
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
  
          this.foodSub.unsubscribe();
        }))
      
      })

     // console.log(this.cartArray);
      
      //this.cartSubscription.unsubscribe();
  }

  async collected(){
    const alert2 = await this.alertCtrl.create({
      header: 'Confirm Collection?',
      message: 'Change(s) is IRREVERSIBLE',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
            this.today = new Date();
           //console.log("Yes")
           //console.log(this.receiptData.orderid);
           //Remove orderid from user db to empty string
           this.userService.updateOrderId(this.userEmail, "").catch((res=>{
             this.showError(res);
           }));
           this.orderService.updateComplete(this.receiptData.orderid, this.today).catch((res=>{
             this.showError(res);
           }));
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
             
           })).catch((res=>{
             this.showError(res);
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

  async showClipboardMsg(){
    const toast = await this.toast.create({message: "Copied to clipboard", position: 'bottom', duration: 3000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  ionViewWillLeave(){
   
    if(this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
    if(this.getPaidBoolean){
      this.getPaidBoolean.unsubscribe();
    }
    if(this.historySub){
      this.historySub.unsubscribe();
    }
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
    
  }
  ngOnDestroy(){
    //console.log("Destroy");
    if(this.receiptSubscription){
      this.receiptSubscription.unsubscribe();
    }
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.canteenSub){
      this.canteenSub.unsubscribe();
    }
    if(this.getStallNameSubscription){
      this.getStallNameSubscription.unsubscribe();
    }
    if(this.vendorOrderSub){
      this.vendorOrderSub.unsubscribe();
    }

  }

  
 

}
