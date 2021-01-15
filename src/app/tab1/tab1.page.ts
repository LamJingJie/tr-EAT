import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular'; 
import { Router } from '@angular/router';
import {CanteenService} from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
//users: User[] = [];
userRole: any;
userEmail: any;
test: any;
canteenSub: Subscription;
customBackBtnSubscription: Subscription;
canteen: any = [];
data: boolean;

  sliderConfig={
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 3.5,
    slidesPerGroup: 3.5,
    roundLengths: true,
  }


  constructor(private canteenService: CanteenService, private alertController: AlertController, private router: Router,
    public authService: AuthenticationService,private  userService: UserService,public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth, private storage: Storage, private http: HttpClient, private platform: Platform) {
    this.data = true;
    
    this.canteenSub = canteenService.getAll().subscribe((data) => {this.canteen = data;});

    

   // this.userRole = this.authService.currentUserRole();
   // this.userEmail = this.authService.currentUserEmail();
    //alert(this.userRole);
    //alert(this.userEmail);

    
 // console.log("Local Storage vendor: " + localStorage.getItem('vendor'));
    
  }

  ngOnInit(){
   
    
  }

  ChosenCanteen(data){
    console.log(data);
  }

  ngOnDestroy(){
    if(this.canteenSub){
      this.canteenSub.unsubscribe();
    }
    
  }

    ionViewWillEnter(){
    this.storage.get('email').then(res=>{
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
