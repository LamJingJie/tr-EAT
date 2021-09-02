import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController, PickerController } from '@ionic/angular';
import { rejects } from 'assert';
import { KeyValuePipe } from '@angular/common';
import { CartTotalCostPipe } from 'src/app/pages/foodlist/cart-total-cost.pipe';

//Database Imports
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

//Services Imports
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

//Component and Modal Imports
import { CategoryfilterComponent } from 'src/app/component/categoryfilter/categoryfilter.component';
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  foodSubscription: Subscription;
  getfoodSubscription: Subscription;

  getfoodSubscription2: Subscription;
  filterfoodSubscription: Subscription;
  cartSubscription: Subscription;
  foodRedemSub: Subscription;
  studentDataSub: Subscription;

  getPaid: Subscription;

  checkOrderSubscription: Subscription;

  userSub: Subscription;
  userSub2: Subscription;
  redeemSub: Subscription;

  favFood1Sub: Subscription;
  favFood2Sub: Subscription;

  getCanteenSubscription: Subscription;
  getCanteenSubscription2: Subscription;

  canteennameSubscription: Subscription;
  canteennameSubscription2: Subscription;

  vendor: any;
  stall: any;
  canteen: any;
  cuisinename: any;
  foodlistArray: any = [];
  redeemfoodArray: any = [];

  cartArray: any = [];

  chosenFilter: any;
  chosenFilter2: any; //For halal or vegetarian

  userRole: any;
  userEmail: any;

  count: any;
  countCart: any; //

  currentAmt: any;
  keysArray: any[] = [];
  valueArray: any[] = [];
  combineArray: any[] = [];

  CartkeysArray: any[] = [];
  CartvalueArray: any[] = [];

  cartnewArray: any[] = [];
  storefoodpriceArray: any[] = [];

  foodtotalprice: any[] = [];
  totalPriceAll: number;

  stampsLeft: number;
  orderid: any;

  foodM = new Map();
  cartM = new Map();
  cartM2 = new Map();

  number: number;
  currentAccount: any

  //Changes made below
  favs: any;
  condition: any;
  favouritedlist: any;

  today: Date;
  today2: Date;
  ordersMade: boolean; //for students, true if they have made any orders today, false if not.

  paid: boolean = false;

  currentRole: any;

  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private orderService: OrderService,
    private keyvalue: KeyValuePipe,
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController,
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private popoverCtrl: PopoverController,
    private storage: Storage,
    private cartService: CartService,
    private carttotalcostpipe: CartTotalCostPipe,
    private firestore: AngularFirestore,
    private loading: LoadingController,
    private canteenService: CanteenService) 
    
    {
    
    this.count = 1;
    this.currentAmt = 1;
  }

  async ngOnInit() {
    //changes here 
    this.userEmail = await this.storage.get('email');
    this.userRole = await this.storage.get('role');
    this.chosenFilter2 = 'all'
    //console.log("ngOnInit");
    this.getfoodSubscription = this.activatedRoute.queryParams.subscribe(params => {

      this.stall = params.stall;
      this.vendor = params.vendor;
      this.canteen = params.canteenid;
      this.chosenFilter = params.cuisinename;
      this.filterFood(this.chosenFilter, this.chosenFilter2)
      //console.log("Chosen filter: "  + this.chosenFilter)

      //console.log(this.stall);
      //console.log(this.vendor);
    });


  }

  async aboutus_modal() {
    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();
  }

  cartPage() {
    this.router.navigate(['/tabs/tab2']);
  }

  async ionViewWillEnter() {

    this.today = new Date();
    this.today2 = new Date();
    this.today.setHours(0, 0, 0, 0); //Start
    this.today2.setHours(23, 59, 59, 999); //End

    //console.log(this.canteen);
    this.userEmail = await this.storage.get('email');
    this.calculateTotalCost();

    this.userRole = await this.storage.get('role');
 

    if (this.userRole === 'student') {
      this.getStudentData();

      //Check if current user has made any orders today
      this.checkOrderSubscription = this.orderService.checkOrders(this.userEmail, this.today, this.today2).subscribe((res => {
        //console.log(res);
        //Empty, means no orders made by students and so redeem btn is activated
        if (res.length == 0) {
          this.ordersMade = false;
        } else {
          this.ordersMade = true;
        }
      }))
    }

    if (this.userRole === 'sponsor') {
      this.checkIfPaid();
    }

  }

  checkIfPaid() {
    this.getPaid = this.userService.getOne(this.userEmail).subscribe((res => {
      this.paid = res['paid'];
    }))
  }

  getStudentData() {
    this.studentDataSub = this.userService.getOne(this.userEmail).subscribe((res => {
      this.orderid = res['orderid'];
      this.stampsLeft = res['stampLeft'];
    }))
  }



  calculateTotalCost() {
    this.cartArray = [];
    //Set hashmap keys
    this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res => {
      //this.cartM.clear();
      //this.cartM2.clear();
      //var count = 0;
      this.countCart = 0;
      //console.log(res);
      this.cartArray = res;

      //Reset everytime page is opened. This is to prevent any consistency issues relating to the data inside
      this.totalPriceAll = 0;

      this.cartArray.forEach((resEach, index) => {

        //Calculate total price
        this.foodSubscription = this.foodService.getFoodById(resEach.id).pipe(first()).subscribe((resFood => {
          this.cartArray[index].price = resFood['foodprice'];
          this.totalPriceAll += resEach['orderquantity'] * this.cartArray[index].price;
          //console.log(this.totalPriceAll);

        }))

        this.countCart = this.countCart + 1;
      })

      /* res.forEach((res=>{
         //console.log(res);
         this.cartM.set(res.id, count); //Set the food.id
         //console.log(this.cartM.entries());
         this.cartM2.set(count, res['orderquantity']);
         count = count + 1;
         
       }))*/
      this.cartSubscription.unsubscribe();
      //this.getKeysCart();
    }))
  }

  ionViewWillLeave() {
    if (this.foodSubscription) {
      this.foodSubscription.unsubscribe();
    }
    if (this.filterfoodSubscription) {
      this.filterfoodSubscription.unsubscribe();
    }
   
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.getfoodSubscription2) {
      this.getfoodSubscription2.unsubscribe();
    }
    if (this.foodRedemSub) {
      this.foodRedemSub.unsubscribe();
    }
    if (this.studentDataSub) {
      this.studentDataSub.unsubscribe();
    }
    if (this.checkOrderSubscription) {
      this.checkOrderSubscription.unsubscribe();
    }
    if (this.getPaid) {
      this.getPaid.unsubscribe();
    }
    //canteen name, id and stall name for sponsor, vendors, admin
    if(this.canteennameSubscription){
      this.canteennameSubscription.unsubscribe();
    }
    if(this.getCanteenSubscription){
      this.getCanteenSubscription.unsubscribe();
    }

    //canteen name, id and stall name for students
    if(this.canteennameSubscription2){
      this.canteennameSubscription2.unsubscribe();
    }
    if(this.getCanteenSubscription2){
      this.getCanteenSubscription2.unsubscribe();
    }

  }

  ionViewDidEnter() {

  }

  addAmt(foodid) {
    var amt = this.foodM.get(foodid);
    amt = amt + 1;
    this.foodM.set(foodid, amt);
    this.getKeys();
  }

  deductAmt(foodid) {
    var amt = this.foodM.get(foodid);
    if (amt > 1) {
      amt = amt - 1;
      this.foodM.set(foodid, amt);
      this.getKeys();
    }

  }

  //Sponsors
  async CartFood(foodid, foodname, vendorid, canteenid) {
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
          this.filterFood(this.chosenFilter, this.chosenFilter2); //refresh
        } else {
          //Get vendor 'listed' boolean field and canteen id
          this.userSub2 = this.userService.getOne(vendorid).subscribe((userres => {
            var listed = userres['listed'];
            var canteenid = userres['canteenID'];
                //check if admin has archived the canteen
                  this.canteenService.getCanteenbyid(canteenid).pipe(first()).subscribe((canteenres=>{
                    var canteendelete = canteenres['deleted'];

                    if(canteendelete === true){
                      this.showError('Canteen is unavailable currently.')
                        this.loading.dismiss(null, null, 'cart');
                        //this.navCtrl.pop(); //go back to prev page.
                        this.filterFood(this.chosenFilter, this.chosenFilter2);//Refresh page
                    }else{
                      //Check if vendor is currently listed
                      if (listed === true) {
                        this.cartService.addToCart(foodid, this.userEmail, canteenid, amountOrdered, vendorid).then((res => {
                          this.CartshowSuccess(foodname123);
                          this.calculateTotalCost();
                          this.filterFood(this.chosenFilter, this.chosenFilter2);
                          this.loading.dismiss(null, null, 'cart');
                        })).catch((err => {
                          this.showError(err);
                          this.loading.dismiss(null, null, 'cart');
                          this.filterFood(this.chosenFilter, this.chosenFilter2);//Refresh page
                        }))
          
                      } else {
                        this.showError('Vendor is unavailable currently.')
                        this.loading.dismiss(null, null, 'cart');
                        this.navCtrl.pop(); //go back to prev page.
                      }
                    } 
                  }))
            
            this.userSub2.unsubscribe();
          }))

        }
      })

    } else {
      this.showError('Unable to add to cart as the admin has not confirmed your previous purchase');
      this.router.navigate(['/tabs/tab2']);
    }
  }

  //Changes Here
  //These codes is for getting and retrieving based on favourites
  async addFoodbyFavourites(foodid) {
    (await this.firestore.collection('favourites')
    .doc(this.userEmail)).collection('data')
    .doc(foodid).set({ foodid: foodid })
    .then((res) => { console.log(res);
 
        this.filterFood(this.chosenFilter, this.chosenFilter2);//refresh
     })
    .catch((err) => { console.log(err) });
  }

  deleteFav(foodid){
    //console.log(foodid);
    this.deleteFoodbyFavourites(foodid);
  }

  async deleteFoodbyFavourites(foodid) {
    //console.log(foodid);
    (await this.firestore.collection('favourites').doc(this.userEmail))
      .collection('data').doc(foodid).delete().then((res) => {
        this.filterFood(this.chosenFilter, this.chosenFilter2); //refresh
         //console.log(res); 
       }).catch((err) => { console.log(err) });
  }

  async getFoodbyfavourites(userid) {
    //console.log(userid);
    return this.firestore.collection("favourites").doc(userid).collection("data").valueChanges();
  }
  //Changes End

  //Student
  async RedeemFood(id, foodname, foodprice: number, vendorid, canteenid) {

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
                this.filterFood(this.chosenFilter, this.chosenFilter2); //refresh
                this.loading.dismiss(null, null, 'redeem');
              } else {

                //Get vendor 'listed' boolean field
                this.userSub = this.userService.getOne(vendorid).subscribe((userres => {
                  var listed = userres['listed'];
                  var canteenid = userres['canteenID'];
                  //check if admin has archived the canteen
                  this.canteenService.getCanteenbyid(canteenid).pipe(first()).subscribe((canteenres=>{
                    var canteendelete = canteenres['deleted'];

                    if(canteendelete === true){
                      this.showError('Canteen is unavailable currently.')
                        this.loading.dismiss(null, null, 'redeem');
                        this.filterFood(this.chosenFilter, this.chosenFilter2); //refresh
                    }else{
                    //Check if vendor is currently listed
                      if (listed === true) {
    
                        //Get latest data
                        this.redeemSub = this.foodService.getFoodById(id).subscribe((res => {
                          var availquantity = res['availquantity'];
                          var popularity = res['popularity'];
                          var foodprice: number = res['foodprice'];
                          var foodname = res['foodname'];
                          var image = res['image'];
                          console.log("foodprice: " + foodprice);
    
                          //console.log(availquantity);
    
                          if (availquantity > 0) {
                            var todayDate: Date = new Date();
                            var stamp = 1;
                            //console.log(canteenid);
                            //console.log(id);
                            //console.log(vendorid);
                            //console.log(this.userEmail);
                            //console.log(foodname);
                            
                            //Create new order
                            this.orderService.addOrders(canteenid, todayDate, foodname, foodprice, image, stamp, this.userEmail, vendorid, id)
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
    
                                //Get orders id and update student's 'orderid' field to that
                                await this.userService.updateOrderId(this.userEmail, res.id);
    
                                //Go to cart page to show receipt of redeemed food
                                this.router.navigate(['/tabs/tab2']);
    
                                this.loading.dismiss(null, null, 'redeem');
    
                                this.RedeemshowSuccess(food_name);
    
                              })).catch((err => {
                                this.showError(err);
                                this.loading.dismiss(null, null, 'redeem');
                              }))
                          } else {
                            this.showError("Food no longer available")
                            this.filterFood(this.chosenFilter, this.chosenFilter2); //refresh
                            this.loading.dismiss(null, null, 'redeem');
                          }
    
                          this.redeemSub.unsubscribe();
                        }))
                      } else {
                        this.showError('Vendor is unavailable currently.')
                        this.loading.dismiss(null, null, 'redeem');
                        this.navCtrl.pop(); //go back to prev page.
                      }
                    }

                  }))
                  
                  this.userSub.unsubscribe();
                }))
              }
            }).catch(err => {
              this.showError(err);
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

  async CartshowSuccess(foodname) {
    const toast = await this.toast.create({ message: '"' + foodname + '"' + ' has been added to cart.', position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  async RedeemshowSuccess(foodname) {
    const toast = await this.toast.create({ message: '"' + foodname + '"' + ' has been successfully redeemed! You have to collect it before you can make your next redeem.', position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  //Get food based on which filter user chose
  filterFood(filter, filter2) {

    //console.log("inside", filter);
    //console.log("inside2", filter2);
    //console.log(this.userRole);

    //For sponsors and vendor
    if (this.userRole === 'sponsor' || this.userRole === 'vendor' || this.userRole === 'admin') {
      this.foodM.clear(); //reset hashmap
      //console.log('1')
      this.filterfoodSubscription = this.foodService.getFoodBasedOnCuisineNFilter(filter, filter2).subscribe((res => {

        this.foodlistArray = res;

        //console.log(this.foodlistArray);
        res.forEach((resData, index) => {
          //console.log(res.id);
          this.foodM.set(resData.id, this.count); //Store each food with count = 1

          //retrieve canteen id
          this.getCanteenSubscription =  this.userService.getOne(resData['userid']).pipe(first()).subscribe((userRes=>{
            //console.log(userRes);
            this.foodlistArray[index].canteenid = userRes['canteenID'];
            this.foodlistArray[index].stall = userRes['stallname'];
            this.foodlistArray[index].userlisted = userRes['listed'];
            this.foodlistArray[index].userdeleted = userRes['deleted'];
            //get canteen name
            this.canteennameSubscription = this.canteenService.getCanteenbyid(userRes['canteenID']).pipe(first()).subscribe((canteenRes=>{
              this.foodlistArray[index].canteen = canteenRes['canteenname'];
              this.foodlistArray[index].canteendeleted = canteenRes['deleted'];
           
            }))
        
          }))

        })
        this.getKeys();

        //This function is for the "favourites button" it loops and retrieves the favourites and shows if it is favourite or not 
    this.favFood1Sub =  this.foodService.getFoodbyfavourites(this.userEmail).subscribe((data) => {
      this.favs = data.map((x) => x.foodid)
      //console.log(this.favs)

      for (var i = 0; i < this.foodlistArray.length; i++) {
             
        //console.log(this.foodlistArray[i].id)
        for (var j = 0; j < this.favs.length; j++) {
          
          //console.log(this.favs[j])
          if (this.foodlistArray[i].id === this.favs[j]) {
            //console.log("true")
            this.foodlistArray[i].favourites = true
            break;
            //console.log(this.foodlistArray[i])
          }
          else { this.foodlistArray[i].favourites = false }
        }
        //console.log(this.redeemfoodArray[i].id)
      }
        //console.log(this.foodlistArray)
     this.favFood1Sub.unsubscribe();
    })
        //console.log(this.foodM.entries());
        this.filterfoodSubscription.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }



    //For students
    if (this.userRole === 'student') {
      //For students
     // console.log(filter);
     //console.log('students')
      this.foodRedemSub = this.foodService.getRedeemableFoodNFilter2(filter,filter2).subscribe((res => {
        //console.log(res);
        
        this.redeemfoodArray = res;
        res.forEach((resData, index) => {
          //console.log(res.id);

          //retrieve canteen id
          this.getCanteenSubscription2 =  this.userService.getOne(resData['userid']).pipe(first()).subscribe((userRes=>{
            //console.log(userRes);
            this.redeemfoodArray[index].canteenid = userRes['canteenID'];
            this.redeemfoodArray[index].stall = userRes['stallname'];
            this.redeemfoodArray[index].userlisted = userRes['listed'];
            this.redeemfoodArray[index].userdeleted = userRes['deleted'];
            //get canteen name
            this.canteennameSubscription2 = this.canteenService.getCanteenbyid(userRes['canteenID']).pipe(first()).subscribe((canteenRes=>{
              this.redeemfoodArray[index].canteen = canteenRes['canteenname']
              this.redeemfoodArray[index].canteendeleted = canteenRes['deleted'];
              
            }))
            
          }))

        })
       // console.log(this.redeemfoodArray);
        this.favFood2Sub =  this.foodService.getFoodbyfavourites(this.userEmail).subscribe((data) => {
          this.favs = data.map((x) => x.foodid)
          //console.log(this.favs)    
    
            for (var i = 0; i < this.redeemfoodArray.length; i++) {
             
              //console.log(this.redeemfoodArray[i].id)
              for (var j = 0; j < this.favs.length; j++) {
                
                //console.log(this.favs[j])
                if (this.redeemfoodArray[i].id === this.favs[j]) {
                  //console.log("true")
                  this.redeemfoodArray[i].favourites = true
                  break;
                  //console.log(this.foodlistArray[i])
                }
                else { this.redeemfoodArray[i].favourites = false }
              }
              //console.log(this.redeemfoodArray[i].id)
            }
            //console.log(this.redeemfoodArray)
            this.favFood2Sub.unsubscribe();
         
        })
        
        this.foodRedemSub.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }
  }



  getKeys() {
    let keys = Array.from(this.foodM.keys());
    let values = Array.from(this.foodM.values());
    this.keysArray = keys;
    this.valueArray = values;
  }

  //Filter button
  async filter(ev) {
    const popover = await this.popoverCtrl.create({
      component: FoodfilterComponent,
      event: ev,
      translucent: true,
      componentProps: { chosenFilter: this.chosenFilter2 },
      cssClass: 'filter-popover'

    });

    //Store the data user clicked on the popover and run a filtering function 
    popover.onDidDismiss().then((res => {

      //console.log(res.data.title);
      this.chosenFilter2 = res.data.title;
      //console.log(this.chosenFilter2)
      this.filterFood(this.chosenFilter, this.chosenFilter2);

    })).catch((err => {
      //If user did not select anything and clicked on the outside
      //console.log(err);
    }))

    return await popover.present();

  }

  async showError(error) {
    const toast = await this.toast.create({ message: error, position: 'bottom', duration: 5000, buttons: [{ text: 'ok', handler: () => { console.log('Cancel clicked'); } }] });
    toast.present();
  }

  dismiss() {
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    if (this.getfoodSubscription) {
      this.getfoodSubscription.unsubscribe();
    }
  }
}
