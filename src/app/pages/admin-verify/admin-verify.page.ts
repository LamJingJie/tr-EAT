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
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalVerifypurchasePage } from 'src/app/Modal/modal-verifypurchase/modal-verifypurchase.page';

@Component({
  selector: 'app-admin-verify',
  templateUrl: './admin-verify.page.html',
  styleUrls: ['./admin-verify.page.scss'],
})
export class AdminVerifyPage implements OnInit {

  sponsorSubscription: Subscription;
  sponsorArray: any[] = [];

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController, private storage: Storage, private cartService: CartService, 
    private carttotalcostpipe: CartTotalCostPipe, private firestore: AngularFirestore, private loading: LoadingController,
    private canteenService: CanteenService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    //Get sponsor accounts that are pending for verification of purchase
    this.sponsorSubscription = this.userService.getOnlySponsor_Unverfied().subscribe((res=>{
      this.sponsorArray = res;
    }))
  }

  async verifyPurchase(sponsorid){
    const modal = await this.modalCtrl.create({
      component: ModalVerifypurchasePage,
      cssClass: 'modal_verifypurchase_class',
      componentProps:{
        user: sponsorid
      }
    });
    await modal.present();

    await modal.onWillDismiss().then((res=>{
      
    }));
  }

  dismiss(){
    this.navCtrl.pop();
  }

  ionViewWillLeave(){
    if(this.sponsorSubscription){
      this.sponsorSubscription.unsubscribe();
    }
  }

}
