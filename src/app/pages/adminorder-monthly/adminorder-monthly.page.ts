import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import {PickerOptions} from '@ionic/core';
import {CalendarModalPage} from 'src/app/Modal/calendar-modal/calendar-modal.page';


@Component({
  selector: 'app-adminorder-monthly',
  templateUrl: './adminorder-monthly.page.html',
  styleUrls: ['./adminorder-monthly.page.scss'],
})
export class AdminorderMonthlyPage implements OnInit {

  //Vendor
  vendorSubscription: Subscription;
  count: number;
  vendorArray: any[] =[]; //Store all the vendors
  vendorArray2: any[] =[]; //store keys from hashmap in vendorM

  vendorM = new Map();
  vendorM2= new Map();

  //Orders
  currentindex: any = [];
  orderSubscription: Subscription;
  newOrderArray: any[] =[]; //Store all the vendors

  //next month
  tmr: Date = new Date();
  //tmr2: Date = new Date();
  tmrVar: any = new Date();

  //this month
  today: Date = new Date();
  //today2: Date = new Date();
  todayVar: any = new Date();

  today3: string = new Date().toISOString();

  //last month
  ytd: Date = new Date();
  //ytd2: Date = new Date();
  ytdVar: any = new Date();
  //ytdVar2: any = new Date();

  //2 months ago
  ytdMinus1: Date = new Date();
 // ytdMinus1_2: Date = new Date();
  ytdMinus1Var: any = new Date();

  //3 months ago
  ytdMinus2: Date = new Date();
  //ytdMinus2_2: Date = new Date();
  ytdMinus2Var: any = new Date();

  //4 months ago
  ytdMinus3: Date = new Date();
  //ytdMinus3_2: Date = new Date();
  ytdMinus3Var: any = new Date();

  //5 months ago
  ytdMinus4: Date = new Date();
  //ytdMinus4_2: Date = new Date();
  ytdMinus4Var: any = new Date();


  onload:boolean = false;

  segmentModel:any;


  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController) {

      
     }

  ionViewWillEnter(){
    this.onload = true; //prevent ionChange from executing until finish executing getOrders function
    this.get6Months(this.today);
    
    this.vendorSubscription = this.userService.getVendor().subscribe((res=>{
      
      this.vendorArray = res;
      
      this.getOrders(this.today, this.tmr, this.vendorArray).then((res=>{
        this.onload = false;
      }));
      this.vendorSubscription.unsubscribe();
     }))
     
   
  }
  ngOnInit() {
  }



  get6Months(date123: Date){
    //console.log(date123);
    //console.log(date123.getFullYear())

    //next month
    this.tmrVar = this.tmr.setFullYear(date123.getFullYear(), date123.getMonth() + 1, 1);
    this.tmr.setHours(0,0,0,0);


    //This month
    this.todayVar = this.today.setFullYear(date123.getFullYear(), date123.getMonth(), 1);
    this.today.setHours(0,0,0,0);
    this.segmentModel = this.todayVar //ensure that the segment is checked for today's date
    //console.log("tday: " + this.todayVar + "Segment: " + this.segmentModel);

    
    //Last Month
    this.ytdVar = this.ytd.setFullYear(date123.getFullYear(), date123.getMonth() -1, 1);
    this.ytd.setHours(0,0,0,0); //Start 
    //console.log("ytd: " + this.ytd);

  
    //2 months ago
    this.ytdMinus1Var = this.ytdMinus1.setFullYear(date123.getFullYear(), date123.getMonth() -2, 1);
    this.ytdMinus1.setHours(0,0,0,0); //Start
    //console.log("ytd -1: " + this.ytdMinus1Var);

    
    //3 months ago
    this.ytdMinus2Var = this.ytdMinus2.setFullYear(date123.getFullYear(),date123.getMonth() -3,1);
    this.ytdMinus2.setHours(0,0,0,0); //Start
    //console.log("ytd -2: " +this.ytdMinus2Var);

    
    //4 months ago
    this.ytdMinus3Var =  this.ytdMinus3.setFullYear(date123.getFullYear(),date123.getMonth() -4,1);
    this.ytdMinus3.setHours(0,0,0,0); //Start
    //console.log("ytd -3: " +this.ytdMinus3Var);


    //5 months ago
    this.ytdMinus4Var =  this.ytdMinus4.setFullYear(date123.getFullYear(),date123.getMonth() -5, 1);
    this.ytdMinus4.setHours(0,0,0,0); //Start
    //console.log("ytd -4: " +this.ytdMinus4Var); 

 }

 getOrders(date1, date2, vendorArray: any[]){
   console.log('order')
  return new Promise(async (resolve, reject)=>{

    //console.log(date1)
    //console.log(date2);
      
    this.orderSubscription = this.orderService.getMonthly(date1, date2).subscribe((resMonth=>{
      this.newOrderArray = [];  
      //this.vendorM.clear();
      //this.vendorM2.clear();
      //console.log(resMonth);
      //this.newOrderArray = res;
      //console.log(this.newOrderArray);
      this.count = 0;
      //this.newOrderArray.length;
      vendorArray.forEach((vendorres=>{
        this.vendorM.set(vendorres.id, this.count);
        this.vendorM2.set(this.count, vendorres.id);
        this.count ++
      }))
      let keys = Array.from(this.vendorM.keys());
      this.vendorArray2 = keys;
     
      //console.log(this.vendorArray2);
  
      resMonth.map((currElement, index)=>{
   
        //console.log("Current Iteration: " + index);
        //console.log("Current Element: " + currElement['foodname']);
        //console.log(currElement);
        this.currentindex = this.vendorM.get(currElement['vendorID']);
        //console.log("Vendor Key from hashmap: " + this.currentindex);
        //this.vendorM1.set(this.currentindex, currElement);
  
        //Checks whether this array exists and is set to an array or not. I also not rlly sure how this works but hey it works
        this.newOrderArray[this.currentindex] = this.newOrderArray[this.currentindex] || []; 
        
        this.newOrderArray[this.currentindex].unshift(currElement);
  
        //console.log(this.newOrderArray);
      });
        
      console.log(this.newOrderArray);
  
      this.orderSubscription.unsubscribe();
       
      this.getTotalCost();
      console.log("calculate")
      resolve("Loaded");
    }))
  })
 
 }

 getTotalCost(){

  //console.log(this.newOrderArray);
  //Transform using keyvalue pipe to allow me to loop through every row and calculate its total price for each vendor
  var orderArray12 = this.keyvalue.transform(this.newOrderArray);
  //console.log(orderArray123);
  for(let order of orderArray12){
    var total = 0;
    //console.log("order: " + order.value);

    for(let o of order.value){    
      //console.log("Price: "+o.foodprice);  
      total = total + o.foodprice;
      this.currentindex = this.vendorM.get(o.vendorID);
      //console.log(this.currentindex);

    }
    //console.log("Index:" + this.currentindex);
   // console.log("Total Cost: " + total)

    this.newOrderArray[this.currentindex] = this.newOrderArray[this.currentindex] || []; 
    this.newOrderArray[this.currentindex].push(total);
    //console.log(this.newOrderArray);

  }
}

  dateChanged(event){
    //console.log(event);
    switch(event.detail.value){
      case this.todayVar.toString():{
        
        if(this.onload === false){
          console.log("this month");
          this.getOrders(this.today, this.tmr, this.vendorArray);
        }
        
        break;
      }

      case this.ytdVar.toString():{
        console.log("last month");
        this.getOrders(this.ytd, this.today, this.vendorArray);
        break;
      }
        
      case this.ytdMinus1Var.toString():{
        console.log("2 months ago");
        this.getOrders(this.ytdMinus1, this.ytd, this.vendorArray);
        break;
      }
        
      case this.ytdMinus2Var.toString():{
        console.log("3 months ago");
        this.getOrders(this.ytdMinus2, this.ytdMinus1, this.vendorArray);
        break;
      }
        
      case this.ytdMinus3Var.toString():{
        console.log("4 months ago");
        this.getOrders(this.ytdMinus3, this.ytdMinus2, this.vendorArray);
        break;
      }
        
      case this.ytdMinus4Var.toString():{
        console.log("5 months ago");
        this.getOrders(this.ytdMinus4, this.ytdMinus3, this.vendorArray);
        break;
      }       

      default:{
        console.log("Error: no date matches in monthly admin order");
        break;
      }
        
    }
    
    //console.log(event.detail.value)
    /*if(event.detail.value == this.todayVar){
      console.log("this month");
      this.getOrders(this.today, this.tmr);
    }
    if(event.detail.value == this.ytdVar){
      console.log("last month");
      this.getOrders(this.ytd, this.today);
    }
    if(event.detail.value == this.ytdMinus1Var){
      console.log("2 months ago");
      this.getOrders(this.ytdMinus1, this.ytd);
    }
    if(event.detail.value == this.ytdMinus2Var){
      console.log("3 months ago");
      this.getOrders(this.ytdMinus2, this.ytdMinus1);
    }
    if(event.detail.value == this.ytdMinus3Var){
      console.log("4 months ago");
      this.getOrders(this.ytdMinus3, this.ytdMinus2);
    }
    if(event.detail.value == this.ytdMinus4Var){
      console.log("5 months ago");
      this.getOrders(this.ytdMinus4, this.ytdMinus3);
    }*/
   
    //console.log(event.detail.value);
  }

  dateChanged2(event){
    //console.log(event.detail.value)
    let date: Date = new Date(event.detail.value);

    this.get6Months(date);
  }

  dismiss(){
    this.navCtrl.pop();
  }

  ionViewWillLeave(){
    console.log("Leave")
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
  }

  ngOnDestroy(){
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
  }

}
