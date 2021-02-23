import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
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
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-tab6',
  templateUrl: 'tab6.page.html',
  styleUrls: ['tab6.page.scss']
})
export class Tab6Page {
  customBackBtnSubscription: Subscription;
  sponsorSubscription: Subscription;
  foodSubscription: Subscription;
  userSub2: Subscription;
  getPaid: Subscription;
  filterfoodSubscription: Subscription;
  checkOrderSubscription: Subscription;
  getfoodSubscription: Subscription;
  studentDataSub: Subscription;
  foodRedemSub: Subscription;
  getfoodSubscription2: Subscription;
  cartSubscription: Subscription;
  redeemSub: Subscription;
  userSub: Subscription;
  userSub3: Subscription;
  userSub4: Subscription;
  canteenSub: Subscription;
  favFood1Sub:Subscription;
  favFood2Sub: Subscription;

  today: Date;
  today2: Date;

  userRole: string;
  userEmail: string;
  search_text: string;

  foodM = new Map();
  cartM = new Map();
  cartM2 = new Map();

  foodlist: any[] = [];
  loadedfoodlist: any[] = [];
  redeemfoodArray: any[] = [];

  keysArray: any[] = [];
  valueArray: any[] = [];

  count: number;
  currentAmt: number;
  verify_count: number;
  currentAccount: any

  favs: any;
  foodlistArray: any = [];

  paid: boolean;
  ordersMadeTday: boolean; //for students, true if they have made any orders today, false if not.

  orderid: string;
  stampsLeft: number;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router,
    private navCtrl: NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController, private storage: Storage, private cartService: CartService,
    private carttotalcostpipe: CartTotalCostPipe, private firestore: AngularFirestore, private loading: LoadingController,
    private canteenService: CanteenService, private platform: Platform, private changeRef: ChangeDetectorRef) {
    this.count = 1;
    this.currentAmt = 1;

  }

  deleteFav(foodid){
    console.log(foodid);
    this.deleteFoodbyFavourites(foodid);
  }

  async ngOnInit() {
    //console.log("Init")
    this.currentAccount = await this.storage.get('email')

    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');


    if (this.userRole === 'student') {
      this.getStudentData();

    }

    if (this.userRole === 'sponsor') {
      this.checkIfPaid();
    }


  }

  async ionViewWillEnter() {

    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');
    this.search_text = ""//Reset search bar
      this.getFoodList(); //refresh//refresh
    if (this.userRole === 'student') {
      this.checkOrders();
    }

    if (this.platform.is('android')) {
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601, () => {
        this.leavePopup();
      });
    }

  }

  checkOrders() {
    this.today = new Date();
    this.today2 = new Date();
    this.today.setHours(0, 0, 0, 0); //Start
    this.today2.setHours(23, 59, 59, 999); //End

    //Check if current user has made any orders today
    this.checkOrderSubscription = this.orderService.checkOrders(this.userEmail, this.today, this.today2).subscribe((res => {
      //console.log(res);
      //Empty, means no orders made by students and so redeem btn is activated
      if (res.length == 0) {
        this.ordersMadeTday = false;
      } else {
        this.ordersMadeTday = true;
      }
    }))
  }

  checkIfPaid() {
    this.getPaid = this.userService.getOne(this.userEmail).subscribe((res => {
      this.paid = res['paid'];
      console.log("Paid Data")
    }))
  }

  getStudentData() {
    this.studentDataSub = this.userService.getOne(this.userEmail).subscribe((res => {
      console.log("Stud Data")
      this.orderid = res['orderid'];
      this.stampsLeft = res['stampLeft'];
    }))
  }

  getFoodList() {
    if (this.userRole === 'sponsor' || this.userRole === 'vendor' || this.userRole === 'admin') {
      this.foodM.clear(); //reset hashmap

      this.foodSubscription = this.foodService.getAllFood().subscribe((res => {
        console.log("Food List Data")
        //console.log(res);
        res.forEach((res, index) => {
          //console.log(res.id);
          this.foodM.set(res.id, this.count); //Store each food with count = 1
          this.userSub3 = this.userService.getOne(res['userid']).pipe(first()).subscribe((userres => {
            this.foodlist[index].stall = userres['stallname'];
            this.loadedfoodlist[index].stall = userres['stallname'];
            this.foodlist[index].userlisted = userres['listed'];
            this.loadedfoodlist[index].userlisted = userres['listed'];
            this.foodlist[index].userdeleted = userres['deleted'];
            this.loadedfoodlist[index].userdeleted = userres['deleted'];
            //get canteen name
            this.canteenSub = this.canteenService.getCanteenbyid(userres['canteenID']).subscribe((canteenres => {
              this.foodlist[index].canteen = canteenres['canteenname'];
              this.loadedfoodlist[index].canteen = canteenres['canteenname'];
              this.foodlist[index].canteendeleted = canteenres['deleted'];
              this.loadedfoodlist[index].canteendeleted = canteenres['deleted'];
            }))
          }))
        })

        this.foodlist = res;
        this.loadedfoodlist = res;
        this.getKeys();
         //This function is for the "favourites button" it loops and retrieves the favourites and shows if it is favourite or not 
    this.favFood1Sub =  this.foodService.getFoodbyfavourites(this.currentAccount).subscribe((data) => {
      this.favs = data.map((x) => x.foodid)
      //console.log(this.favs)

      for (var i = 0; i < this.foodlist.length; i++) {
             
        //console.log(this.foodlist[i].id)
        for (var j = 0; j < this.favs.length; j++) {
          
          //console.log(this.favs[j])
          if (this.foodlist[i].id === this.favs[j]) {
            //console.log("true")
            this.foodlist[i].favourites = true
            break;
            //console.log(this.foodlist[i])
          }
          else { this.foodlist[i].favourites = false }
        }
        //console.log(this.redeemfoodArray[i].id)
      }
        //console.log(this.foodlistArray)
     this.favFood1Sub.unsubscribe();
    })
      //console.log(this.foodlist);
        //console.log(this.foodM.entries());
        this.foodSubscription.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }

    if (this.userRole === 'student') {

      //For students
      this.foodRedemSub = this.foodService.getRedeemableFood_ALL().subscribe((res => {

        res.forEach((res, index) => {
          //get stall name
          this.userSub4 = this.userService.getOne(res['userid']).pipe(first()).subscribe((userres => {
            this.foodlist[index].stall = userres['stallname'];
            this.loadedfoodlist[index].stall = userres['stallname'];
            this.foodlist[index].userlisted = userres['listed'];
            this.loadedfoodlist[index].userlisted = userres['listed'];
            this.foodlist[index].userdeleted = userres['deleted'];
            this.loadedfoodlist[index].userdeleted = userres['deleted'];
            //get canteen name
            this.canteenSub = this.canteenService.getCanteenbyid(userres['canteenID']).subscribe((canteenres => {
              this.foodlist[index].canteen = canteenres['canteenname'];
              this.loadedfoodlist[index].canteen = canteenres['canteenname'];
              this.foodlist[index].canteendeleted = canteenres['deleted'];
              this.loadedfoodlist[index].canteendeleted = canteenres['deleted'];
            }))
          }))

        })
        this.foodlist = res;
        this.loadedfoodlist = res;
        //console.log(this.foodlist);

         //This function is for the "favourites button" it loops and retrieves the favourites and shows if it is favourite or not 
    this.favFood2Sub =  this.foodService.getFoodbyfavourites(this.currentAccount).subscribe((data) => {
      this.favs = data.map((x) => x.foodid)
      //console.log(this.favs)

      for (var i = 0; i < this.foodlist.length; i++) {
             
       // console.log(this.foodlist[i].id)
        for (var j = 0; j < this.favs.length; j++) {
          
          //console.log(this.favs[j])
          if (this.foodlist[i].id === this.favs[j]) {
            console.log("true")
            this.foodlist[i].favourites = true
            break;
            //console.log(this.foodlistArray[i])
          }
          else { this.foodlist[i].favourites = false }
        }
        //console.log(this.redeemfoodArray[i].id)
      }
        //console.log(this.foodlist)
     this.favFood2Sub.unsubscribe();
    })
        this.foodRedemSub.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }
  }

  initializeItems() {
    //Reset items
    this.foodlist = this.loadedfoodlist;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items and show all foods again
    if (!q) {
      //console.log("Empty");
      //this.getFoodList();
      return;
    } else {
      //refreshes the cart amount for hashmap to keep consistency on which food that is currently present
      this.foodM.clear();
    }

    this.foodlist = this.foodlist.filter((v) => {
      //console.log(v.foodname);
      if (v.foodname && q) {
        //Filter by foodname
        if (v.foodname.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          this.foodM.set(v.id, this.count); //Store each food with count = 1
          //console.log('filter' + v.foodname + v.id)
          return true;
        }
        return false;
      }

    });
    this.getKeys();
    this.changeRef.detectChanges();
    //console.log(q, this.foodlist.length);
  }

  addAmt(foodid) {
    //console.log(foodid);
    var amt = this.foodM.get(foodid);
    amt = amt + 1;
    //console.log(this.currentAmt);
    this.foodM.set(foodid, amt);
    //console.log(this.foodM.entries());
    this.getKeys();
  }

  deductAmt(foodid) {
    //console.log(foodid);
    var amt = this.foodM.get(foodid);
    if (amt > 1) {
      amt = amt - 1;
      //console.log(this.currentAmt);
      this.foodM.set(foodid, amt);
      //console.log(this.foodM.entries());
      this.getKeys();
    }

  }
  //Changes made 
  async addFoodbyFavourites(foodid) {
    (await this.firestore.collection('favourites').doc(this.currentAccount)).collection('data').doc(foodid).set({ foodid: foodid }).then((res) => {
      this.search_text = ""//Reset search bar
      this.getFoodList(); //refresh//refresh 
      //console.log(res);
       }).catch((err) => { console.log(err) });

  }

  async deleteFoodbyFavourites(foodid) {
   // console.log(foodid);
    (await this.firestore.collection('favourites').doc(this.currentAccount)).collection('data').doc(foodid).delete().then((res) => { 
      this.search_text = ""//Reset search bar
      this.getFoodList(); //refresh//refresh
      //console.log(res); 
    }).catch((err) => { console.log(err) });

  }

  async getFoodbyfavourites(userid) {
    //console.log(userid);
    return this.firestore.collection("favourites").doc(userid).collection("data").valueChanges();
  }
  //Sponsors
  async CartFood(foodid, foodname, vendorid) {
    //Add data into cart 

    //If paid allow to add to cart
    if (this.paid === false) {
      var foodname123 = foodname;
      await this.presentLoadCart();
      var amountOrdered = this.foodM.get(foodid);
      //console.log(amountOrdered);
      //Check if food has been deleted by admin before continuing.
      var foodDoc = this.firestore.collection('food').doc(foodid);

      foodDoc.get().toPromise().then(doc => {
        if (!doc.exists) {
          this.showError("Food does not exists");
          this.loading.dismiss(null, null, 'cart');
          // this.filterFood(this.chosenFilter); //refresh
          this.getFoodList(); //refresh
        } else {
          //Get vendor 'listed' boolean field
          this.userSub2 = this.userService.getOne(vendorid).subscribe((userres => {
            var listed = userres['listed'];
            //Check if vendor is currently listed
            if (listed === true) {
              this.cartService.addToCart(foodid, this.userEmail, userres['canteenID'], amountOrdered, vendorid).then((res => {
                this.CartshowSuccess(foodname123);
                this.getFoodList(); //refresh
                //this.calculateTotalCost(); 
                this.loading.dismiss(null, null, 'cart');
              })).catch((err => {
                this.showError(err);
                this.loading.dismiss(null, null, 'cart');
                //this.filterFood(this.chosenFilter);//Refresh page
                this.getFoodList(); //refresh
              }))

            } else {
              this.showError('Vendor is unavailable currently.')
              this.loading.dismiss(null, null, 'cart');
              this.getFoodList(); //refresh
            }
            this.userSub2.unsubscribe();
          }))

        }
      })

    } else {
      this.showError('Unable to add to cart as the admin has not confirmed your previous purchase');
      this.router.navigate(['/tabs/tab2']);
    }
  }

  getKeys() {
    let keys = Array.from(this.foodM.keys());
    let values = Array.from(this.foodM.values());
    this.keysArray = keys;
    this.valueArray = values;
  }

  //Student
  async RedeemFood(id, foodname, foodprice: number, vendorid) {

    var food_name = foodname;

    const alert1 = await this.alertCtrl.create({
      header: 'Confirmation of Redemption',
      message: 'Are you sure you would like to redeem the following item' + '<br><br><br><br>' + '1x ' + foodname + "  $" + foodprice,
      buttons: [
        {
          text: 'Confirm',
          handler: async () => {
            await this.presentLoadRedeem();

            //Check if food has been deleted by admin before continuing.
            var foodDoc = this.firestore.collection('food').doc(id);

            foodDoc.get().toPromise().then(doc => {
              if (!doc.exists) {
                this.showError("Food does not exists");
                //this.filterFood(this.chosenFilter); //refresh
                this.getFoodList(); //refresh
                this.loading.dismiss(null, null, 'redeem');
              } else {

                //Get vendor 'listed' boolean field
                this.userSub = this.userService.getOne(vendorid).subscribe((userres => {
                  var listed = userres['listed'];
                  //Check if vendor is currently listed
                  if (listed === true) {

                    //Get latest data
                    this.redeemSub = this.foodService.getFoodById(id).subscribe((res => {
                      var availquantity = res['availquantity'];
                      var popularity = res['popularity'];
                      var foodprice: number = res['foodprice'];
                      var foodname = res['foodname'];
                      var image = res['image'];

                      //console.log(availquantity);

                      if (availquantity > 0) {
                        var todayDate: Date = new Date();
                        var stamp = 1;

                        //Create new order
                        this.orderService.addOrders(userres['canteenID'], todayDate, foodname, foodprice, image, stamp, this.userEmail, vendorid, id)
                          .then((async res => {

                            popularity = popularity + 1;
                            this.stampsLeft = this.stampsLeft - 1;
                            availquantity = availquantity - 1;
                            //console.log(availquantity);
                            //console.log(stampsLeft);

                            //Decrease available quantity of that food
                            this.foodService.decreaseAvailQuantity(id, availquantity);

                            //Deduct stamp
                            this.userService.updateStamp(this.userEmail, this.stampsLeft);

                            //Increase food popularity
                            this.foodService.updatePopularity(id, popularity);
                            this.getFoodList(); //refresh
                            //Get orders id and update student's 'orderid' field to that
                            await this.userService.updateOrderId(this.userEmail, res.id);

                            //Go to cart page to show receipt of redeemed food
                            this.router.navigate(['/tabs/tab2']);

                            this.loading.dismiss(null, null, 'redeem');

                            //Link to the 'cart' tab2 page showing the receipt, at the bottom of the receipt, will have a button that
                            //says "Got it" that when click will remove the data in 'orderid' field and update the 'completed' field from
                            //false to true.
                            this.RedeemshowSuccess(food_name);

                          })).catch((err => {
                            this.showError(err);
                            this.loading.dismiss(null, null, 'redeem');
                          }))
                      } else {
                        this.showError("Food no longer available")
                        this.getFoodList(); //refresh
                        this.loading.dismiss(null, null, 'redeem');
                      }

                      this.redeemSub.unsubscribe();
                    }))
                  } else {
                    this.showError('Vendor is unavailable currently.')
                    this.loading.dismiss(null, null, 'redeem');
                    this.getFoodList(); //refresh
                  }
                  this.userSub.unsubscribe();
                }))
              }
            }).catch(err => {
              this.showError(err);
              this.getFoodList(); //refresh
              this.loading.dismiss(null, null, 'redeem');
            })
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

  //Refresh
  doRefresh(event) {
    if (event.target.complete()) {
      if(this.checkOrderSubscription){
        this.checkOrderSubscription.unsubscribe();
      }
      
      this.checkOrders();
      this.getFoodList();
      this.search_text = ""//Reset search bar
    }
  }

  ionViewWillLeave() {

    if (this.platform.is('android')) {
      if (this.customBackBtnSubscription) {
        this.customBackBtnSubscription.unsubscribe();
      }
    }
    if (this.sponsorSubscription) {
      this.sponsorSubscription.unsubscribe();
    }

    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.getfoodSubscription2) {
      this.getfoodSubscription2.unsubscribe();
    }
    if (this.checkOrderSubscription) {
      this.checkOrderSubscription.unsubscribe();
    }
    if (this.canteenSub) {
      this.canteenSub.unsubscribe();
    }
    if (this.userSub3) {
      this.userSub3.unsubscribe();
    }
    if (this.userSub4) {
      this.userSub4.unsubscribe();
    }
  }

  async aboutus_modal() {

    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();

  }

  ionViewDidLeave() {
  }

  ngOnDestroy() {
    if (this.studentDataSub) {
      this.studentDataSub.unsubscribe();
    }
    if (this.getPaid) {
      this.getPaid.unsubscribe();
    }
  }

  async showError(error) {
    const toast = await this.toast.create({ message: error, position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  async CartshowSuccess(foodname) {
    const toast = await this.toast.create({ message: '"' + foodname + '"' + ' has been added to cart.', position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  async RedeemshowSuccess(foodname) {
    const toast = await this.toast.create({ message: '"' + foodname + '"' + ' has been successfully redeemed! You have to collect it before you can make your next redeem.', position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  async presentLoadRedeem() {
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Redeeming...',
      id: 'redeem'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

  }

  async presentLoadCart() {
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Adding to cart...',
      id: 'cart'
    });
    await loading3.present();
    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it
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








}
