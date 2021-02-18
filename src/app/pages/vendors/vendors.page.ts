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
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.page.html',
  styleUrls: ['./vendors.page.scss'],
})
export class VendorsPage implements OnInit {
  canteen_chosen: any;
  canteen_name: any;

  canteenSubscription: Subscription;
  canteenSubscription2: Subscription; //for canteen name

  vendorSubscription: Subscription;
  AllVendorSubscription: Subscription;

  vendorArray: any = [];

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private canteenService: CanteenService) { 

      

    }

  ngOnInit() {

    this.canteenSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.canteen_chosen = params.canteenid;
      //Get canteen name
      this.canteenSubscription2 = this.canteenService.getCanteenbyid(params.canteenid).subscribe((res=>{
        this.canteen_name = res['canteenname'];
      }))
      //console.log(this.canteen_chosen);
      if(this.canteen_chosen === 'ALL'){
        this.getAllVendors();
      }else{
        this.getVendors(this.canteen_chosen);
      }
     
    });
  }

  async aboutus_modal(){


    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();

  }

  selectedStall(vendor, stall, canteenid){
    //console.log(stall);
    let navigationExtras: NavigationExtras = { queryParams: {vendor: vendor , stall: stall, canteenid: canteenid} };   
    this.router.navigate(['/tabs/tab1/vendors/foodlist'], navigationExtras);
  }

  getAllVendors(){
    this.AllVendorSubscription = this.userService.getOnlyVendor().subscribe((res =>{
      this.vendorArray = res;
      //console.log(res);
    }))
  }

  getVendors(canteen){
    this.vendorSubscription = this.userService.getVendorBasedOnCanteen(canteen).subscribe((res=>{
      //console.log(res);
      this.vendorArray = res;
    }))
  }

  ngOnDestroy(){
    if(this.canteenSubscription){
      this.canteenSubscription.unsubscribe();
    }
    if(this.canteenSubscription2){
      this.canteenSubscription2.unsubscribe();
    }
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
    if(this.AllVendorSubscription){
      this.AllVendorSubscription.unsubscribe();
    }
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
