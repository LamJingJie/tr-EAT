import { Component } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { CanteenService } from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { FoodService } from '../services/food/food.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  //users: User[] = [];
  userRole: any;
  userEmail: any;
  test: any = [];
  canteenSub: Subscription;
  foodSub: Subscription;
  customBackBtnSubscription: Subscription;
  canteen: any = [];
  cuisinename: any = [];
  data: boolean;

  test1: Subscription;
  test2: Subscription;

  colorChose: any;
  colorLoop: any;

  sliderConfig = {
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 2.5,
    roundLengths: true
  }

  sliderConfigx = {
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 1.7,
    roundLengths: true
  }


  constructor(private canteenService: CanteenService, private alertCtrl: AlertController, private router: Router,
    public authService: AuthenticationService, private userService: UserService, public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth, private storage: Storage, private http: HttpClient, private platform: Platform,
    private foodService: FoodService, private modalCtrl: ModalController, private localNotifications: LocalNotifications) {
    this.data = true;

   
    //Changes added 
    /*this.foodSub = foodService.getAllFood().subscribe((data) => {
      this.cuisinename = data;
      //console.log(data);
      //Changes ended
    });*/

    // this.userRole = this.authService.currentUserRole();
    // this.userEmail = this.authService.currentUserEmail();
    //alert(this.userRole);
    //alert(this.userEmail);
    // console.log("Local Storage vendor: " + localStorage.getItem('vendor'));
  }

  async ngOnInit() {
    this.userRole = await this.storage.get('role');
    //console.log("init")
    this.canteenSub = this.canteenService.getAll().subscribe((data) => {
      this.canteen = data;
    });
  }

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

  ChosenCanteen(canteenid) {
    //console.log(canteenid);
    let navigationExtras: NavigationExtras = { queryParams: { canteenid: canteenid } };
    this.router.navigate(['/tabs/tab1/vendors'], navigationExtras);
  }

  ChosenCuisines(cuisinename,) {
    let navigationExtras: NavigationExtras = { queryParams: { cuisinename: cuisinename } };
    this.router.navigate(['/tabs/tab1/category'], navigationExtras);

  }


  ngOnDestroy() {
    if (this.canteenSub) {
      this.canteenSub.unsubscribe();
    }
    //console.log("destroy")

    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }
  }

  async ionViewWillEnter() {
    if (this.platform.is('android')) {
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601, () => {
        this.leavePopup();
      });
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

  ionViewWillLeave() {
    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }
  }
}


