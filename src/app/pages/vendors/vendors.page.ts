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

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.page.html',
  styleUrls: ['./vendors.page.scss'],
})
export class VendorsPage implements OnInit {
  canteen_chosen: any;
  canteenSubscription: Subscription;

  vendorSubscription: Subscription;
  AllVendorSubscription: Subscription;

  vendorArray: any = [];

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute) { 

      

    }

  ngOnInit() {

    this.canteenSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.canteen_chosen = params.canteenid;
      //console.log(this.canteen_chosen);
      if(this.canteen_chosen === 'ALL'){
        this.getAllVendors();
      }else{
        this.getVendors(this.canteen_chosen);
      }
     
    });
  }

  selectedStall(vendor, stall){
    //console.log(stall);
    let navigationExtras: NavigationExtras = { queryParams: {vendor: vendor , stall: stall} };   
    this.router.navigate(['foodlist'], navigationExtras);
  }

  getAllVendors(){
    this.AllVendorSubscription = this.userService.getOnlyVendor().subscribe((res =>{
      this.vendorArray = res;
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
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
    if(this.AllVendorSubscription){
      this.AllVendorSubscription.unsubscribe();
    }
  }

  dismiss(){
    this.navCtrl.back();
  }

}
