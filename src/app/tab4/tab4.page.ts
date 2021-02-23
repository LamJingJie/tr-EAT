import { Component } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { CanteenService } from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OrderService } from 'src/app/services/order/order.service';
import { FoodService } from 'src/app/services/food/food.service';
import { first } from 'rxjs/operators';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  currentAccount: any;
  currentRole: any;

  stamps: any; //Student

  customBackBtnSubscription: Subscription;
  orderSubscription: Subscription;
  userSub: Subscription;
  canteenSubscription: Subscription;
  favSub: Subscription;
  userSub2: Subscription;
  foodSub: Subscription;
  fav: any;
  fav2: Subscription;

  orderArray: any[] = [];
  //top5_orderArray: any[] = [];
  foodArray: any[] = [];

  sliderConfigx={
    spaceBetween: .5,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 1.5,
    roundLengths: true
  }


  constructor(private platform: Platform, private router: Router, private alertCtrl: AlertController,
    private authService: AuthenticationService, private storage: Storage, private userService: UserService,
    private orderService: OrderService, private canteenService: CanteenService, private foodService: FoodService, private modalCtrl: ModalController, private firestore: AngularFirestore,) { }

  async ngOnInit() {
    this.currentAccount = await this.storage.get('email');
    this.currentRole = await this.storage.get('role');



    if (this.currentRole == 'student') {
      this.getStamps();
    }


  }

  async ionViewWillEnter() {

    if (this.platform.is('android')) {
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601, () => {
        this.leavePopup();
      });
    }

    this.currentAccount = await this.storage.get('email');
    this.currentRole = await this.storage.get('role');

    if (this.currentRole == 'vendor') {
      this.getVendorFood();
    }

    this.favSub = this.foodService.getFoodbyfavourites(this.currentAccount).subscribe((data) => {
      this.fillfav(data);
    })
    //Changes below
    //console.log(this.currentAccount);
    
  }
  fillfav(data) {
    this.fav = [];
    data.forEach((element: any) => {
      this.fav2 = this.foodService.getFoodById(element.foodid).pipe(first()).subscribe((res) => {
        //console.log(res)
        this.fav.push(res)
       
      })
    });
  }
  //Changes End

  async aboutus_modal() {
    //Unsubscribe back btn
    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }

    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();

    await modal.onWillDismiss().then(res => {
      //Resubscribes back btn
      if (this.platform.is('android')) {
        this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601, () => {
          this.leavePopup();
        });
      }
    })
  }

  getStamps() {
    this.userSub = this.userService.getOne(this.currentAccount).subscribe((res => {
      this.stamps = res['stampLeft'];
      //console.log(res);
    }))
  }

  getVendorFood() {
    this.foodSub = this.foodService.getFoodBasedOnStall(this.currentAccount).pipe(first()).subscribe((res => {
      this.foodArray = res;
      //console.log(this.foodArray);
      this.foodArray.forEach((val, index) => {
        //Get canteen id
        this.userSub2 = this.userService.getOne(this.currentAccount).pipe(first()).subscribe((userres => {
          var canteenid = userres['canteenID'];
          //Get canteen name and color
          this.canteenSubscription = this.canteenService.getCanteenbyid(canteenid).pipe(first()).subscribe((canteenres => {
            this.foodArray[index].canteenname = canteenres['canteenname'];
            this.foodArray[index].canteencolor = canteenres['color'];
          }))
        }))
      })
    }))

    //console.log(this.foodArray);
  }
  //NEed to fix refreshing of profile   
  async deleteFoodbyFavourites(foodid) {
    //console.log(foodid);
    (await this.firestore.collection('favourites').doc(this.currentAccount)).collection('data').doc(foodid).delete().then((res) => { console.log(res); }).catch((err) => { console.log(err) });

  }

  SignOut() {
    this.authService.SignOut();
  }

  ionViewWillLeave() {
    
    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }
   
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if(this.favSub){
      this.favSub.unsubscribe();
    }
    if (this.foodSub) {
      console.log("Leave")
      this.foodSub.unsubscribe();
    }
    if (this.userSub2) {
      this.userSub2.unsubscribe();
    }
    if (this.canteenSubscription) {
      this.canteenSubscription.unsubscribe();
    }
  }

  async leavePopup() {

    const alert1 = await this.alertCtrl.create({
      message: 'Close the application?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
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



  ngOnDestroy() {
    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    
    

    
    
  }
}
