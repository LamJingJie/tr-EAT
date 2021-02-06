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
import { FoodfilterComponent } from 'src/app/component/foodfilter/foodfilter/foodfilter.component'
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalAboutusPage } from 'src/app/Modal/modal-aboutus/modal-aboutus.page';

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
foodRedemSub: Subscription;
studentDataSub: Subscription;

getPaid: Subscription;

checkOrderSubscription: Subscription;


userSub: Subscription;
userSub2: Subscription;
redeemSub: Subscription;

vendor: any;
stall: any;
canteen: any;
foodlistArray: any = [];
redeemfoodArray: any = [];

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

stampsLeft: number;
orderid: any;


foodM = new Map();
cartM = new Map();
cartM2 = new Map();

number: number;

today: Date = new Date();
today2: Date = new Date();
ordersMade: boolean; //for students, true if they have made any orders today, false if not.

paid: boolean = false;


  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController, private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private popoverCtrl: PopoverController, private storage: Storage, private cartService: CartService, 
    private carttotalcostpipe: CartTotalCostPipe, private firestore: AngularFirestore, private loading: LoadingController,
    private canteenService: CanteenService) {

      this.chosenFilter = 'all'
      this.count = 1;
      this.currentAmt = 1;
      
     }

  ngOnInit() {
    //console.log("ngOnInit");
   

    this.getfoodSubscription = this.activatedRoute.queryParams.subscribe(params =>{
      this.stall = params.stall;
      this.vendor = params.vendor;
      this.canteen = params.canteenid;
      //console.log(this.stall);
      //console.log(this.vendor);
    });

     

  }

  
  async aboutus_modal(){


    const modal = await this.modalCtrl.create({
      component: ModalAboutusPage,
      cssClass: 'modal_aboutus_class'
    });
    await modal.present();


  }

  cartPage(){
    this.router.navigate(['/tabs/tab2']);
  }

  async ionViewWillEnter(){

    this.today.setHours(0,0,0,0); //Start
    this.today2.setHours(23,59,59,999); //End
    
    //console.log(this.canteen);
    this.userEmail = await this.storage.get('email');
    this.calculateTotalCost();
    

    this.userRole = await this.storage.get('role');
    this.filterFood(this.chosenFilter);

    if(this.userRole === 'student'){
      this.getStudentData();

      //Check if current user has made any orders today
      this.checkOrderSubscription = this.orderService.checkOrders(this.userEmail, this.today, this.today2).subscribe((res=>{
        //console.log(res);
        //Empty, means no orders made by students and so redeem btn is activated
        if(res.length == 0){
          this.ordersMade = false;
        }else{
          this.ordersMade = true;
        }
      }))
    }

    if(this.userRole === 'sponsor'){
      this.checkIfPaid();
    }
   
   
  }

  checkIfPaid(){
    this.getPaid = this.userService.getOne(this.userEmail).subscribe((res=>{
      this.paid = res['paid'];
    }))
  }

  getStudentData(){
    this.studentDataSub = this.userService.getOne(this.userEmail).subscribe((res=>{
      this.orderid = res['orderid'];
      this.stampsLeft = res['stampLeft'];
    }))
  }




  calculateTotalCost(){
    this.cartArray = [];
     //Set hashmap keys
     this.cartSubscription = this.cartService.getAllCart(this.userEmail).subscribe((res=>{
      //this.cartM.clear();
      //this.cartM2.clear();
      //var count = 0;
      this.countCart =0;
      //console.log(res);
      this.cartArray = res;
      
      //Reset everytime page is opened. This is to prevent any consistency issues relating to the data inside
      this.totalPriceAll = 0;

      this.cartArray.forEach((resEach,index)=>{

        //Calculate total price
        this.foodSubscription = this.foodService.getFoodById(resEach.id).pipe(first()).subscribe((resFood=>{
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

  ionViewWillLeave(){
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
    if( this.foodRedemSub){
      this.foodRedemSub.unsubscribe();
    }
    if(this.studentDataSub){
      this.studentDataSub.unsubscribe();
    }
    if(this.checkOrderSubscription){
      this.checkOrderSubscription.unsubscribe();
    }
    if(this.getPaid){
      this.getPaid.unsubscribe();
    }
   
  }


  /*getKeysCart(){
    let keys = Array.from(this.cartM.keys());
    let values = Array.from(this.cartM.values());
    this.CartkeysArray = keys;
    this.CartvalueArray = values;
    //this.getFoodPrice();
    //console.log(this.CartvalueArray);
    //console.log(this.CartvalueArray);
  }*/



  //Do not touch. Because I have no idea how this even worked.
  /*getFoodPrice(){
    
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
   
  }*/

  ionViewDidEnter(){
    
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

  //Sponsors
  async CartFood(foodid, foodname, vendorid){
    //Add data into cart 

    //If paid allow to add to cart
    if(this.paid === false){
      var foodname123 = foodname;
      await this.presentLoadCart();
      var amountOrdered = this.foodM.get(foodid);
      //console.log(amountOrdered);
      //Check if food has been deleted by admin before continuing.
      var foodDoc = this.firestore.collection('food').doc(foodid);

      foodDoc.get().toPromise().then(doc=>{
        if(!doc.exists){
          this.showError("Food does not exists");
          this.loading.dismiss(null,null,'cart');
          this.filterFood(this.chosenFilter); //refresh
        }else{
            //Get vendor 'listed' boolean field
            this.userSub2 = this.userService.getOne(vendorid).subscribe((userres=>{
            var listed = userres['listed'];
            //Check if vendor is currently listed
            if(listed === true){
              this.cartService.addToCart(foodid, this.userEmail, this.canteen, amountOrdered, vendorid).then((res=>{
                this.CartshowSuccess(foodname123);
                this.calculateTotalCost();
                this.filterFood(this.chosenFilter);
                this.loading.dismiss(null,null,'cart');
              })).catch((err=>{
                this.showError(err);
                this.loading.dismiss(null,null,'cart');
                this.filterFood(this.chosenFilter);//Refresh page
              }))
                
            }else{
              this.showError('Vendor is unavailable currently.')
              this.loading.dismiss(null,null,'cart');
              this.navCtrl.pop(); //go back to prev page.
            }
            this.userSub2.unsubscribe();
          }))
           
        }
      })
      
    }else{
      this.showError('Unable to add to cart as you have not confirm your previous purchase');
      this.router.navigate(['/tabs/tab2']);
    }   
  }

  //Student
  async RedeemFood(id,  foodname, foodprice: number, vendorid, image){
  
    var food_name = foodname;
    
    const alert1 = await this.alertCtrl.create({
      header: 'Confirmation of Redemption',
      message: 'Are you sure you would like to redeem the following item' + '<br><br><br><br>' + '1x ' + foodname + "  $"+foodprice,
      buttons:[
        {
          text: 'Confirm',
          handler:async ()=>{
            await this.presentLoadRedeem();

            //Check if food has been deleted by admin before continuing.
            var foodDoc = this.firestore.collection('food').doc(id);

            foodDoc.get().toPromise().then(doc=>{
              if(!doc.exists){
                this.showError("Food does not exists");
                this.filterFood(this.chosenFilter); //refresh
                this.loading.dismiss(null,null,'redeem');
              }else{

                //Get vendor 'listed' boolean field
                this.userSub = this.userService.getOne(vendorid).subscribe((userres=>{
                  var listed = userres['listed'];
                  //Check if vendor is currently listed
                  if(listed === true){

                    //Get latest data
                    this.redeemSub = this.foodService.getFoodById(id).subscribe((res=>{
                      var availquantity = res['availquantity'];
                      var popularity = res['popularity'];

                      //console.log(availquantity);

                      if(availquantity > 0){
                        var todayDate: Date = new Date();
                        var stamp = 1;
            
                          //Create new order
                          this.orderService.addOrders(this.canteen, todayDate, foodname, foodprice, image, stamp, this.userEmail, vendorid, id)
                          .then((async res=>{
                            
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
      
                            this.loading.dismiss(null,null,'redeem');
            
                            //Link to the 'cart' tab2 page showing the receipt, at the bottom of the receipt, will have a button that
                            //says "Got it" that when click will remove the data in 'orderid' field and update the 'completed' field from
                            //false to true.
                            this.RedeemshowSuccess(food_name);
       
                          })).catch((err =>{
                            this.showError(err);
                            this.loading.dismiss(null,null,'redeem');
                          }))
                        }else{
                          this.showError("Food no longer available")
                          this.filterFood(this.chosenFilter); //refresh
                          this.loading.dismiss(null,null,'redeem');
                        }
                       
                        this.redeemSub.unsubscribe();
                      }))
                  }else{
                    this.showError('Vendor is unavailable currently.')
                    this.loading.dismiss(null,null,'redeem');
                    this.navCtrl.pop(); //go back to prev page.
                  }
                  this.userSub.unsubscribe();
                })) 
              }
            }).catch(err=>{
              this.showError(err);
              this.loading.dismiss(null,null,'redeem');
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

  async presentLoadRedeem(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Redeeming...',
      id: 'redeem'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

  }

  async presentLoadCart(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Adding to cart...',
      id: 'cart'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

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
    //console.log(this.userRole);

    //For sponsors and vendor
    if(this.userRole === 'sponsor' || this.userRole === 'vendor'|| this.userRole === 'admin'){
      this.filterfoodSubscription = this.foodService.getFoodBasedOnStallNFilter(this.vendor, filter).subscribe((res =>{

        this.foodlistArray = res;
        //console.log(this.foodlistArray);
        res.forEach((res=>{
          //console.log(res.id);
          this.foodM.set(res.id, this.count); //Store each food with count = 1
          
        }))
        this.getKeys();
        //console.log(this.foodM.entries());
        this.filterfoodSubscription.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }


    //For students
    if(this.userRole === 'student'){
        //For students
        this.foodRedemSub = this.foodService.getRedeemableFoodNFilter(this.vendor, filter).subscribe((res =>{
          this.redeemfoodArray = res;
          //console.log(this.redeemfoodArray);
          this.foodRedemSub.unsubscribe(); //Unsub because if many users are redeeming food at the same time, page will keep refreshing
      }))
    }
    

  
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
   
  }

}
