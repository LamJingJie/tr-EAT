import { Component } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  currentRole: any;
  //users: User[] = [];
  customBackBtnSubscription: Subscription;
  constructor( private authService: AuthenticationService, private userService: UserService, private storage: Storage,
    private alertCtrl: AlertController, private platform: Platform) {
   
    
  }
  ngOnInit(){
   
  }

  ionViewWillEnter(){
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
    this.storage.get('role').then(res =>{
      this.currentRole = res;
     // console.log("Role tabs: " + this.currentRole);
     // alert("Role tabs: " + this.currentRole);
      
     });
     this.storage.get('email').then(res =>{
    
     // console.log("Email tabs: " + res);
      //alert("Email tabs: " + res);
     });
  }
 
  ionViewDidEnter(){

  }

  ionViewWillLeave(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
  }

  ngOnDestroy(){
   
  }

  async leavePopup(){
    
    const alert1 = await this.alertCtrl.create({
      message: 'Close the application?',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
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