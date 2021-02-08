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
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-verifypurchase',
  templateUrl: './modal-verifypurchase.page.html',
  styleUrls: ['./modal-verifypurchase.page.scss'],
})
export class ModalVerifypurchasePage implements OnInit {
@Input() user: string;

historyArray: any[] = [];
totalPriceAll: number;
historySub:Subscription;

  constructor(private platform: Platform, private alertCtrl: AlertController,private userService: UserService, 
    private authService: AuthenticationService, private router: Router, private navCtrl:NavController,  
    private toast: ToastController,private orderService: OrderService, private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, 
    private foodService: FoodService,private popoverCtrl: PopoverController, private storage: Storage, 
    private cartService: CartService, private loading: LoadingController, private historyService: HistoryService,
    private canteenService: CanteenService, private appLauncher: AppLauncher, private market: Market, private appAvail: AppAvailability,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    //Get data
    this.historySub = this.historyService.getHistoryNotPaid(this.user).subscribe((resArray=>{
      //console.log(resArray);
      this.historyArray = resArray;
      this.totalPriceAll = 0;
      this.historyArray.forEach((res, index)=>{
        this.totalPriceAll  = this.totalPriceAll + res['totalcost'];
      })
      
    }))
  }

  async verify(){

    const alert1 = await this.alertCtrl.create({
      message: 'Has ' + '<b>"' +this.user + '"</b>' + ' paid?' + '<br><br><br><br>' + 'Once accepted, it is irrevisible',
      buttons:[
        {
          text: 'Yes',
          handler:async ()=>{
            
            await this.presentLoadingConfirm();
            var totalquantity = 0;
            this.userService.updatePaid(this.user, false).catch((res=>{
              this.showError(res);
            }));
            this.historyArray.forEach((res, index)=>{
              //console.log(res['id'])
              //console.log(this.userEmail);
              //console.log(res);
              //this.historyService.updateHistoryDate(this.user, res['id'], todayDate);
              this.historyService.updateConfirmPay(this.user, res['id']).catch((res=>{
                this.showError(res);
              }));  //Change confirmpayment boolean to true
        
              //Get latest data for availquantity
              //check if food has been deleted by admin
              var foodDoc = this.firestore.collection('food').doc(res['foodid']);           
              foodDoc.get().toPromise().then(foodDoc =>{                   
                if(foodDoc.exists){
                  totalquantity = foodDoc.get('availquantity') + res['orderquantity'];
                  //console.log(totalquantity);
                  //Add orderquantity to respective food
                  this.foodService.updateAvailQuantity(res['foodid'], totalquantity).catch((res=>{
                    this.showError(res);
                  }));            
                }
              }).catch((res=>{
                this.showError(res);
              }))
            })
            this.loading.dismiss(null,null,'vpay');
            this.dismiss();
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });

    await alert1.present().catch((res=>{
      this.showError(res);
    }));



  }

  //Deny purchase from sponsors 
  async deny(){
    const alert1 = await this.alertCtrl.create({
      message: 'Deny Purchase from ' + '<b>"' + this.user + '"</b>' + '? ' + '<br><br><br><br>' + 'Once denied, it is irrevisible',
      buttons:[
        {
          text: 'Yes',
          handler:async ()=>{
            await this.presentLoadingDeny();
            //Delete unpaid from history database
            this.historyArray.forEach((val, index)=>{
              console.log(val);
              this.historyService.delHistory(this.user, val['id']).catch((res=>{
                this.showError(res);
              }))
            })

            //Update sponsor 'paid' status back to false
            this.userService.updatePaid(this.user, false).catch((res=>{
              this.showError(res);
            }));

            this.loading.dismiss(null,null,'dpay');
            this.dismiss();
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });

    await alert1.present().catch((res=>{
      this.showError(res);
    }));
    
  }

  async presentLoadingConfirm(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message:'Verifying...',
      id: 'vpay'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it
  }

  async presentLoadingDeny(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message:'Denying purchase...',
      id: 'dpay'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  ngOnDestroy(){
    //console.log("Destroy")
    if(this.historySub){
      this.historySub.unsubscribe();
    }
  }

}
