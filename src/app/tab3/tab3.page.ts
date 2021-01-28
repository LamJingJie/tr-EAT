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
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  customBackBtnSubscription: Subscription;
  completedOrderSub: Subscription;
  pastOrderSub: Subscription;
  historysub: Subscription;

  orderArray: any[] = [];

  userEmail: any;
  userRole: any;
  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private historyService: HistoryService, private canteenService: CanteenService) {}


  async ionViewWillEnter(){
    this.orderArray = [];
    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');

    if(this.userRole === 'vendor'){
      this.getCompletedOrders();
    }

    if(this.userRole === 'sponsor'){
      this.getHistory();
    }

    if(this.userRole === 'student'){
      this.getPastOrders();
    }

    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
  }
  ionViewWillLeave(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
    if(this.completedOrderSub){
      this.completedOrderSub.unsubscribe();
    }
    if(this.historysub){
      this.historysub.unsubscribe();
    }
    if(this.pastOrderSub){
      this.pastOrderSub.unsubscribe();
    }
  }

  getPastOrders(){
    this.pastOrderSub = this.orderService.getAllForStudent(this.userEmail, true).subscribe((res=>{
      this.orderArray = res;

      //get canteen name, canteen color and stall name
      this.orderArray.forEach((val, index)=>{
        this.canteenService.getCanteenbyid(val['canteenID']).subscribe((canteenres=>{
          this.orderArray[index].canteenname = canteenres['canteenname']
          this.orderArray[index].canteencolor = canteenres['color'];
        }))

        this.userService.getOne(val['vendorID']).subscribe((userres=>{
          this.orderArray[index].stallname = userres['stallname'];
        }))
      })

    }))
  }

  getHistory(){
    this.historysub = this.historyService.getSponsorHistory(this.userEmail).subscribe((res=>{
      this.orderArray = res;

      //get canteen name, canteen color and stall name
      this.orderArray.forEach((val, index)=>{
        this.canteenService.getCanteenbyid(val['canteenid']).subscribe((canteenres=>{
          this.orderArray[index].canteenname = canteenres['canteenname']
          this.orderArray[index].canteencolor = canteenres['color'];
        }))

        this.userService.getOne(val['vendorid']).subscribe((userres=>{
          this.orderArray[index].stallname = userres['stallname'];
        }))
      })
      console.log(res);
    }))
  }

  getCompletedOrders(){
    this.completedOrderSub = this.orderService.getAllForVendor(this.userEmail, true).subscribe((res=>{
      this.orderArray = res;

      //get canteen name and stall name
      this.orderArray.forEach((val, index)=>{
        this.canteenService.getCanteenbyid(val['canteenID']).subscribe((canteenres=>{
          this.orderArray[index].canteenname = canteenres['canteenname']
          this.orderArray[index].canteencolor = canteenres['color'];
        }))

        this.userService.getOne(val['vendorID']).subscribe((userres=>{
          this.orderArray[index].stallname = userres['stallname'];
        }))
      })

    }))
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
  }
 
 

}
