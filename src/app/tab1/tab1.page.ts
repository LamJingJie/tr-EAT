import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular'; 
import { NavigationExtras, Router } from '@angular/router';
import {CanteenService} from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { FoodService } from '../services/food/food.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 


import '@simonwep/pickr/dist/themes/classic.min.css';   // 'classic' theme
import '@simonwep/pickr/dist/themes/monolith.min.css';  // 'monolith' theme
import '@simonwep/pickr/dist/themes/nano.min.css';      // 'nano' theme
import Pickr from '@simonwep/pickr';


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
customBackBtnSubscription: Subscription;
canteen: any = [];
data: boolean;



test1:Subscription;
test2: Subscription;

colorChose: any;


colorLoop: any;

  sliderConfig={
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 2.5,
    roundLengths: true
  }


  constructor(private canteenService: CanteenService, private alertController: AlertController, private router: Router,
    public authService: AuthenticationService,private  userService: UserService,public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth, private storage: Storage, private http: HttpClient, private platform: Platform,
    private foodService: FoodService ) {
    this.data = true;
    
    this.canteenSub = canteenService.getAll().subscribe((data) => {
      this.canteen = data;
    
    });




    

    

   // this.userRole = this.authService.currentUserRole();
   // this.userEmail = this.authService.currentUserEmail();
    //alert(this.userRole);
    //alert(this.userEmail);

    
 // console.log("Local Storage vendor: " + localStorage.getItem('vendor'));
    
  }


  ngOnInit(){

    const pickr = Pickr.create({
      el: '.color-picker',
      theme: 'classic', // or 'monolith', or 'nano'
  
      components: {
  
          // Main components
          preview: true,
          opacity: true,
          hue: true,
  
          // Input / output Options
          interaction: {
              hex: true,
              rgba: true,
              hsla: true,
              hsva: true,
              cmyk: true,
              input: true,
              clear: false,
              save: true
          }
      }
  });

  //await pickr.show();

  //Instances on when the color picker is opened
  pickr.on('save', (...args) => {
    let colorChosen = args[0].toRGBA();
    
    this.colorChose = colorChosen.toString();
    console.log(this.colorChose);
    (<HTMLElement>document.querySelector('.colorshown')).style.setProperty('--background', this.colorChose);
    pickr.hide();
  });
    
  }




  ChosenCanteen(canteenid){
    //console.log(canteenid);
    let navigationExtras: NavigationExtras = { queryParams: {canteenid: canteenid } };    
    this.router.navigate(['vendors'], navigationExtras);
  }

  ngOnDestroy(){
    if(this.canteenSub){
      this.canteenSub.unsubscribe();
    }
    
  }

  ionViewWillEnter(){
    this.storage.get('role').then(res=>{
      //console.log("email tab1: " + res);
      this.userRole = res;
      
    });
  }

  ionViewWillLeave(){
    
  }




  SignOut(){
    this.authService.SignOut();
  }



}


