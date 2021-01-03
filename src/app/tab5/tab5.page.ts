import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular'; 
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
import { ModalAddvendorPage } from 'src/app/pages/adminaddvendor/modal-addvendor.page';



@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {
  customBackBtnSubscription:Subscription;
  constructor(private authService: AuthenticationService, private modalCtrl: ModalController, private alertCtrl: AlertController,
    private router: Router, private platform: Platform, private navCtrl: NavController) {
     
     
      
    }

    ngOnInit(){
     
    }

  ionViewWillEnter(){
  
  }

  ionViewWillLeave(){
   
  }

  ngOnDestroy(){
   
  }


  async addAccountPopUp(){
    /*const alert = await this.alertCtrl.create({
      header: 'Add Vendor Accounts',
      inputs: [{
        name: 'name1',
        type: 'text',
        placeholder: 'placeholder1'
      }]
    });

    await alert.present();*/


   /* const modal = await this.modalCtrl.create({
      component: ModalAddvendorPage
    });
     await modal.present();*/

     this.router.navigate(['/adminaddvendor']);
     
    
  }

  viewFoodBtn(){
    this.router.navigate(['/adminfood']);
   
  }


  





}