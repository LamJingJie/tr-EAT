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

@Component({
  selector: 'app-modal-verifychckout',
  templateUrl: './modal-verifychckout.page.html',
  styleUrls: ['./modal-verifychckout.page.scss'],
})
export class ModalVerifychckoutPage implements OnInit {
  @Input() cart: any[] = [];
  @Input() total: any;
  @Input() paymentmethod: string;

  foodSub: Subscription;

  
  
  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService,) { }

  ngOnInit() {
    this.cart.forEach((res,index)=>{
      this.foodSub = this.foodService.getFoodById(res['id']).subscribe((foodres=>{
        this.cart[index].foodname = foodres['foodname']; //store foodname
        this.cart[index].individualfoodPrice = foodres['foodprice'] * res['orderquantity']; //total price for individual food
      }))
    })
    //console.log(this.cart);
  }

  pay(){
    console.log(this.total);
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
