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

  pay_foodSub: Subscription;

  todayDate: Date = new Date();
  
  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private loading: LoadingController, private historyService: HistoryService) { 

    }

  ngOnInit() {
    this.cart.forEach((res,index)=>{
      this.foodSub = this.foodService.getFoodById(res['id']).subscribe((foodres=>{
        this.cart[index].foodname = foodres['foodname']; //store foodname
        this.cart[index].individualfoodPrice = foodres['foodprice'] * res['orderquantity']; //total price for individual food
        this.cart[index].availquantity = foodres['availquantity'];
        this.cart[index].image = foodres['image'];
      }))
    })
    //console.log(this.cart);
  }

  async pay(){

  
   console.log(this.cart)
   
   
   await this.presentLoadingPay();
    var totalquantity = 0;
    this.cart.forEach((res, index)=>{
      
      totalquantity = res['availquantity'] + res['orderquantity']
      //console.log(totalquantity);
     
      //1. Add orderquantity to respective food
      this.foodService.updateAvailQuantity(res.id, totalquantity);
      //2. Add cart data into history db
      this.historyService.transfer_cart_to_history(this.user, this.todayDate, res['canteenid'], res.id, res['foodname'],
      res['price'], res['image'], res['orderquantity'], res['userid']);
      //3. Delete all carts data
     
      
    
    })
    await this.cartService.deleteCart(this.user);
    
    this.loading.dismiss(null,null,'pay'); 
  
    this.dismiss();
    
  }

  async presentLoadingPay(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
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

  ngOnDestroy(){
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
  }

}
