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
  selector: 'app-adminorders',
  templateUrl: './adminorders.page.html',
  styleUrls: ['./adminorders.page.scss'],
 //changeDetection: ChangeDetectionStrategy.OnPush // Fix for now (may change in the future)
})
export class AdminordersPage implements OnInit {
  vendorname_match: any;
  vendorArray: any =[]; //Store all the vendors
  vendorArray2: any[] = [];
  orderArray: any = []; //Store all orders
  vendorM = new Map();
  vendorM2= new Map();

  todayDate: Date = new Date();

  count: number;
  currentindex: any = [];
  newOrderArray: any[] = [];
  EachVendorTotal: any[] = [];

  test: any = new Date();

  today: Date = new Date();
  today2: Date = new Date();
  todayVar: any = new Date();

  today3: string = new Date().toISOString();

  ytd: Date = new Date();
  ytd2: Date = new Date();
  ytdVar: any = new Date();

  ytdMinus1: Date = new Date();
  ytdMinus1_2: Date = new Date();
  ytdMinus1Var: any = new Date();

  ytdMinus2: Date = new Date();
  ytdMinus2_2: Date = new Date();
  ytdMinus2Var: any = new Date();

  ytdMinus3: Date = new Date();
  ytdMinus3_2: Date = new Date();
  ytdMinus3Var: any = new Date();

  ytdMinus4: Date = new Date();
  ytdMinus4_2: Date = new Date();
  ytdMinus4Var: any = new Date();

  ytdMinus5: Date = new Date();
  ytdMinus5_2: Date = new Date();
  ytdMinus5Var: any = new Date();

  orderSubscription: Subscription;
  vendorSubscription: Subscription;

  onload:boolean = false;
  segmentModel: any;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private orderService: OrderService, private keyvalue: KeyValuePipe, private modalCtrl: ModalController,
    private pickerCtrl: PickerController) {
   
  
      
     }

  get7Days(date: Date){
   
     //Today Date
     this.todayVar = this.today.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
     this.today.setHours(0,0,0,0); //Start
     this.segmentModel = this.todayVar //ensure that the segment is checked for today's date
     //console.log("tday: " + this.todayVar);
     this.today2.setFullYear( this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
     this.today2.setHours(23,59,59,999); //End



     //Yesterday date
     this.ytdVar = this.ytd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() -1);
     this.ytd.setHours(0,0,0,0); //Start 
     //console.log("ytd: " + this.ytdVar);
     this.ytd2.setFullYear(this.ytd.getFullYear(), this.ytd.getMonth(), this.ytd.getDate());
     this.ytd2.setHours(23,59,59,999); //End



     //Yesterday -1 Date
     this.ytdMinus1Var = this.ytdMinus1.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()-2);
     this.ytdMinus1.setHours(0,0,0,0); //Start
     //console.log("ytd -1: " + this.ytdMinus1Var);
     this.ytdMinus1_2.setFullYear(this.ytdMinus1.getFullYear(), this.ytdMinus1.getMonth(), this.ytdMinus1.getDate());
     this.ytdMinus1_2.setHours(23,59,59,999); //End



     //Yesterday -2 Date
     this.ytdMinus2Var = this.ytdMinus2.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()-3);
     this.ytdMinus2.setHours(0,0,0,0); //Start
     //console.log("ytd -2: " +this.ytdMinus2Var);
     this.ytdMinus2_2.setFullYear(this.ytdMinus2.getFullYear(), this.ytdMinus2.getMonth(), this.ytdMinus2.getDate());
     this.ytdMinus2_2.setHours(23,59,59,999); //End



     //Yesterday -3 Date
     this.ytdMinus3Var = this.ytdMinus3.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() -4);
     this.ytdMinus3.setHours(0,0,0,0); //Start
     //console.log("ytd -3: " +this.ytdMinus3Var);
     this.ytdMinus3_2.setFullYear(this.ytdMinus3.getFullYear(),this.ytdMinus3.getMonth(), this.ytdMinus3.getDate() );
     this.ytdMinus3_2.setHours(23,59,59,999); //End



     //Yesterday -4 Date
     this.ytdMinus4Var = this.ytdMinus4.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() -5);
     this.ytdMinus4.setHours(0,0,0,0); //Start
     //console.log("ytd -4: " +this.ytdMinus4Var);
     this.ytdMinus4_2.setFullYear(this.ytdMinus4.getFullYear(), this.ytdMinus4.getMonth(), this.ytdMinus4.getDate());
     this.ytdMinus4_2.setHours(23,59,59,999); //End



     //Yesterday -5 Date
     this.ytdMinus5Var = this.ytdMinus5.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() -6);
     this.ytdMinus5.setHours(0,0,0,0); //Start
     //console.log("ytd -5: " +this.ytdMinus5Var);
     this.ytdMinus5_2.setFullYear(this.ytdMinus5.getFullYear(), this.ytdMinus5.getMonth(), this.ytdMinus5.getDate());
     this.ytdMinus5_2.setHours(23,59,59,999); //End

  }

  ngOnInit() {
   
  }

  ionViewWillEnter(){
    this.onload = true; //prevent ionChange from executing until finish executing getOrders function
    this.get7Days(this.today);
   
    this.vendorSubscription = this.userService.getVendor().subscribe((res=>{
      
      //console.log(res);
      this.vendorArray = res;
      //console.log(this.vendorArray);
      
      this.getOrders(this.today, this.today2, this.vendorArray).then((res=>{
        this.onload = false;
      }));

      this.vendorSubscription.unsubscribe();
     }))

  }

  dismiss(){
    this.navCtrl.pop();
  }

  //create array based on vendor
  //Create hashmap
  //each vendor has their own array index
  //orders that i retrieved check against this particiulat vendor
  //then plug them to the correct element

  getOrders(date1, date2, vendorArray: any[]){
    return new Promise(async (resolve, reject)=>{
      
      //console.log(date1)
      //console.log(date2)
      this.orderSubscription = this.orderService.getAllOrders(date1, date2).subscribe((res=>{
        this.newOrderArray = [];
        this.vendorM.clear();
        this.vendorM2.clear();
        //console.log(res);
        //this.newOrderArray = res;
        //console.log(this.newOrderArray);
    
        //this.newOrderArray.length;
        this.count = 0;
        vendorArray.forEach((res=>{
          //console.log(res.id);
          this.vendorM.set(res.id, this.count);
          this.vendorM2.set(this.count, res.id);
          this.count ++
          
        }))
        let keys = Array.from(this.vendorM.keys());
        this.vendorArray2 = keys;
        //console.log(this.newVendorArray);
  
  
        res.map((currElement, index)=>{
   
          //console.log("Current Iteration: " + index);
          //console.log("Current Element: " + currElement['foodname']);
          this.currentindex = this.vendorM.get(currElement['vendorID']);
          //console.log("Vendor Key from hashmap: " + this.currentindex);
          //this.vendorM1.set(this.currentindex, currElement);
  
          //Checks whether this array exists and is set to an array or not. I also not rlly sure how this works but hey it works
          this.newOrderArray[this.currentindex] = this.newOrderArray[this.currentindex] || []; 
        
          this.newOrderArray[this.currentindex].unshift(currElement);
  
          //console.log(this.newOrderArray);
        });
        
        //console.log("Finish");
        
        //console.log(this.newOrderArray);
  
        this.orderSubscription.unsubscribe();
       
        this.getTotalCost();
        resolve("Loaded");
      }))
  
    })
    
   
     
     /* let vendorM = new Map();
    this.orderSubscription = this.orderService.getAllOrders(date1, date2).subscribe((res=>{
      console.log(res);
      this.orderArray = res;

      this.orderSubscription.unsubscribe();
    })).add((async res=>{
        
      for await(let vendor of this.vendorArray){
        console.log(vendor);
        await vendorM.set(vendor.id, this.orderArray);
        await vendorM.get(vendor.id);
       
      }
      vendorM.forEach((res=>{
        console.log(res);
        this.orderArrayShow = res;
      }));
      console.log(this.orderArrayShow);
      console.log("Completed For Loop");
    }));*/
   /* for await(let vendor of this.vendorArray){
      this.count = this.count + 1
      await this.test1(vendor.id, date1, date2).then(res=>{
        console.log(vendor);
        console.log(res);
      });
     // console.log(this.vendorM.entries());
    }
    console.log(this.count);
    console.log("Completed For Loop");
    console.log(this.vendorM.entries());*/
    
  }

  getTotalCost(){

    //console.log(this.newOrderArray);
    //Transform using keyvalue pipe to allow me to loop through every row and calculate its total price for each vendor
    var orderArray123 = this.keyvalue.transform(this.newOrderArray);
    //console.log(orderArray123);
    for(let order of orderArray123){
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
    //console.log(event.detail.value)
    //console.log(this.todayVar.toString());
    switch(event.detail.value){
      case this.todayVar.toString():{
        if(this.onload === false){
          this.getOrders(this.today, this.today2, this.vendorArray);
          console.log("Today");
          
        }
        break;
      }

      case this.ytdVar.toString():{
        console.log("Yesterday");
        this.getOrders(this.ytd, this.ytd2, this.vendorArray);
        break;
      }
        
      case this.ytdMinus1Var.toString():{
        console.log("Yesterday -1");
        this.getOrders(this.ytdMinus1, this.ytdMinus1_2, this.vendorArray);
        break;
      }
        
      case this.ytdMinus2Var.toString():{
        console.log("Yesterday -2");
        this.getOrders(this.ytdMinus2, this.ytdMinus2_2, this.vendorArray);
        break;
      }
        
      case this.ytdMinus3Var.toString():{
        console.log("Yesterday -3");
        this.getOrders(this.ytdMinus3, this.ytdMinus3_2, this.vendorArray);
        break;
      }
        
      case this.ytdMinus4Var.toString():{
        console.log("Yesterday -4");
        this.getOrders(this.ytdMinus4, this.ytdMinus4_2, this.vendorArray);
        break;
      }       

      case this.ytdMinus5Var.toString():{
        console.log("Yesterday -5");
        this.getOrders(this.ytdMinus5, this.ytdMinus5_2, this.vendorArray);
        break;
      }  

      default:{
        console.log("Error: no date matches in weekly admin order");
        break;
      }
        
    }
    /*
    if(event.detail.value == this.todayVar){
      console.log("Today");
      this.getOrders(this.today, this.today2);
    }
    if(event.detail.value == this.ytdVar){
      console.log("Yesterday");
      this.getOrders(this.ytd, this.ytd2);
    }
    if(event.detail.value == this.ytdMinus1Var){
      console.log("Yesterday -1");
      this.getOrders(this.ytdMinus1, this.ytdMinus1_2);
    }
    if(event.detail.value == this.ytdMinus2Var){
      console.log("Yesterday -2");
      this.getOrders(this.ytdMinus2, this.ytdMinus2_2);
    }
    if(event.detail.value == this.ytdMinus3Var){
      console.log("Yesterday -3");
      this.getOrders(this.ytdMinus3, this.ytdMinus3_2);
    }
    if(event.detail.value == this.ytdMinus4Var){
      console.log("Yesterday -4");
      this.getOrders(this.ytdMinus4, this.ytdMinus4_2);
    }
    if(event.detail.value == this.ytdMinus5Var){
      console.log("Yesterday -5");
      this.getOrders(this.ytdMinus5, this.ytdMinus5_2);
    }*/

   
    //console.log(event.detail.value);
  }


  dateChanged2(event){

    let date: Date = new Date(event.detail.value);
    //let date2: Date = new Date(event.detail.value);
    date.setHours(0,0,0,0);
    //date2.setHours(23,59,59,999);


    this.get7Days(date);
    //console.log(date2);
  }


  ionViewWillLeave(){
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
    }
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
  }

}
