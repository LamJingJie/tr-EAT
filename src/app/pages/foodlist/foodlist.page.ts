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
foodlistArray: any = [];

chosenFilter: any;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController) {

      this.chosenFilter = 'all'
     }

  ngOnInit() {

    this.foodSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.stall = params.stall;
      this.vendor = params.vendor;
      //console.log(this.stall);
      //console.log(this.vendor);
      this.getfoodlist(this.vendor);
     
    });
  }

  //Get all food on page load
  getfoodlist(vendor){
    this.getfoodSubscription = this.foodService.getFoodBasedOnStall(vendor).subscribe((res =>{
      this.foodlistArray = res;

      this.getfoodSubscription.unsubscribe();
    }))
  }

  //Get food based on which filter user chose
  filterFood(filter){
    console.log(filter);
    this.filterfoodSubscription = this.foodService.getFoodBasedOnStallNFilter(this.vendor, filter).subscribe((res =>{
      //console.log(res);
      this.foodlistArray = res;

      this.filterfoodSubscription.unsubscribe();
    }))
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
