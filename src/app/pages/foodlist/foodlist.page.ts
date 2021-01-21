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
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-foodlist',
  templateUrl: './foodlist.page.html',
  styleUrls: ['./foodlist.page.scss'],
})
export class FoodlistPage implements OnInit {
foodSubscription: Subscription;
getfoodSubscription: Subscription;

getfoodSubscription2: Subscription;
filterfoodSubscription: Subscription;
cartSubscription: Subscription;

vendor: any;
stall: any;
canteen: any;
foodlistArray: any = [];
cartArray: any = [];

chosenFilter: any;

userRole : any;
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


foodM = new Map();
cartM = new Map();
cartM2 = new Map();

number: number;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController, private storage: Storage, private cartService: CartService, 
    private carttotalcostpipe: CartTotalCostPipe) {

      this.chosenFilter = 'all'
      this.count = 1;
      this.currentAmt = 1;
      
     }

  ngOnInit() {
    //console.log("ngOnInit");

    this.foodSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.stall = params.stall;
      this.vendor = params.vendor;
      this.canteen = params.canteenid;
      //console.log(this.stall);
      //console.log(this.vendor);
      this.filterFood(this.chosenFilter);
     
    });
  }

  cartPage(){
    this.router.navigate(['/tabs/tab2']);
  }

  ionViewWillEnter(){

    //Reset arrays everytime page is opened. This is to prevent any consistency issues relating to the data inside each array
    this.totalPriceAll = 0;
    this.storefoodpriceArray = [];
    this.foodtotalprice = [];
    
    //console.log(this.canteen);
    this.storage.get('email').then(async res=>{
      //console.log("email: " + res);
      this.userEmail = res;
      await this.userEmail;

      //Set hashmap keys
      this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res=>{
        this.cartM.clear();
        this.cartM2.clear();
        var count = 0;
        this.countCart =0;
        //console.log(res);
        this.cartArray = res;
        res.forEach((res=>{
          //console.log(res);
          this.cartM.set(res.id, count);
          //console.log(this.cartM.entries());
          this.cartM2.set(count, res['orderquantity']);
          count = count + 1;
          this.countCart = this.countCart + 1;
        }))
        
        
        this.cartSubscription.unsubscribe();
  
        this.getKeysCart();
       
      }))
      
    });
    this.storage.get('role').then(res=>{
      //console.log("role: " + res);
      this.userRole = res;
      
    });
   
  }

  ionViewDidLeave(){
    
   
  }



  //Do not touch. Because I have no idea how this even worked.
  getFoodPrice(){
    
    var keysArray = this.keyvalue.transform(this.CartkeysArray);
    //console.log(keysArray);

    //console.log(keys);
   
    keysArray.map((currElement, index)=>{
     
      //[0] is the foodid
      //[1] is the food price
      //[2] is the order quantity
      this.foodService.getFoodById(currElement.value).pipe(first()).subscribe((res=>{
        
        
        this.storefoodpriceArray[currElement.key] = this.storefoodpriceArray[currElement.value] || [];
        this.storefoodpriceArray[currElement.key].push(currElement.value);  //[0]
        this.storefoodpriceArray[currElement.key].push(res['foodprice']); //[1]
        //console.log(this.cartM2.entries());
        //var int = parseInt(currElement.key);
        var int = Number(currElement.key);
        this.storefoodpriceArray[currElement.key].push(this.cartM2.get(int)); //[2]
        console.log(this.storefoodpriceArray);
        
        //Calculation of total cost for each food
        this.storefoodpriceArray.forEach((res, index)=>{
      

          this.foodtotalprice[index] = this.foodtotalprice[index] || [];
          var totalcostperfood = res[1] * res[2];
         
          this.foodtotalprice[index] = totalcostperfood;
          //console.log(this.foodtotalprice);
        })

        //Calculate total cost
        this.totalPriceAll = 0;
        this.foodtotalprice.forEach((res=>{
          
          //console.log(res);
          this.totalPriceAll = this.totalPriceAll + res;
         
        }))
        //console.log(this.totalPriceAll);
      }))
    })
   
  }

  ionViewDidEnter(){
    
  }

  getKeysCart(){
    let keys = Array.from(this.cartM.keys());
    let values = Array.from(this.cartM.values());
    this.CartkeysArray = keys;
    this.CartvalueArray = values;
    this.getFoodPrice();
    //console.log(this.CartvalueArray);
    //console.log(this.CartvalueArray);
  }

  addAmt(foodid){
   // console.log(foodid);
    var amt = this.foodM.get(foodid);
    amt = amt + 1;
    //console.log(this.currentAmt);
    this.foodM.set(foodid, amt);
    //console.log(this.foodM.entries());
    this.getKeys();
  }

  deductAmt(foodid){
    //console.log(foodid);
    var amt = this.foodM.get(foodid);
    if(amt > 1){
      amt = amt - 1;
      //console.log(this.currentAmt);
      this.foodM.set(foodid, amt);
      //console.log(this.foodM.entries());
      this.getKeys();
    }
   
  }

  //Sponsor
  CartFood(foodid, foodname){
    //Add data into cart 
    var foodname123 = foodname;
    var amountOrdered = this.foodM.get(foodid);
    //console.log(amountOrdered);
    this.cartService.addToCart(foodid, this.userEmail, this.canteen, amountOrdered, foodname).then((res=>{
      this.CartshowSuccess(foodname123);
      setTimeout(()=>{
        this.ionViewWillEnter();
      }, 1000)
     
    })).catch((err=>{
      this.showError(err);
    }))
  }

  //Student
  async RedeemFood(id, quantity, foodname, foodprice, image, vendorid){
    //Show alert box
    var food_name = foodname;
    const alert1 = await this.alertCtrl.create({
      header: 'Confirmation of Redemption',
      message: 'Are you sure you would like to redeem the following item' + '<br><br><br><br>' + '1x ' + foodname + "  $"+foodprice,
      buttons:[
        {
          text: 'Confirm',
          handler:()=>{
            //Use 'vendorid' param to retrieve respective canteenID from 'users' database
            if(quantity > 0){
              quantity = quantity - 1; //Deduct per redeem
              console.log(quantity);

              //Deduct overall value in firebase first
              this.foodService.decreaseAvailQuantity(id, quantity).then((res =>{
                let current_date: any = new Date();
                var stamp = 1;

                //Once completed, then add into orders for vendor to see
                this.orderService.addOrders(this.canteen, current_date, foodname, foodprice, image, stamp, this.userEmail, vendorid)
                .then((res=>{
                  this.RedeemshowSuccess(food_name);

                })).catch((err =>{
                  this.showError(err);

                }))

              })).catch((err =>{
                this.showError(err);

              }))


            }else{
              alert('"' + foodname + '"' + " is currently unavailable. Please redeem another food");  
            }
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


  async CartshowSuccess(foodname){
    const toast = await this.toast.create({message: '"' + foodname + '"' + ' has been added to cart.', position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async RedeemshowSuccess(foodname){
    const toast = await this.toast.create({message: '"' + foodname + '"' + ' has been successfully redeemed! You have to collect it before you can make your next redeem.', position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  //Get food based on which filter user chose
  filterFood(filter){
    //console.log(filter);
    this.filterfoodSubscription = this.foodService.getFoodBasedOnStallNFilter(this.vendor, filter).subscribe((res =>{

      this.foodlistArray = res;
     // console.log(this.foodlistArray);
      res.forEach((res=>{
        //console.log(res.id);
        this.foodM.set(res.id, this.count); //Store each food with count = 1
        
      }))
      this.getKeys();

      //console.log(this.foodM.entries());
      this.filterfoodSubscription.unsubscribe();
    }))
  }

  getKeys(){
    let keys = Array.from(this.foodM.keys());
    let values = Array.from(this.foodM.values());
    this.keysArray = keys;
    this.valueArray = values;
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
  
  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  dismiss(){
    this.navCtrl.pop();
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
    if(this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
    if(this.getfoodSubscription2){
      this.getfoodSubscription2.unsubscribe();
    }
  }

}
