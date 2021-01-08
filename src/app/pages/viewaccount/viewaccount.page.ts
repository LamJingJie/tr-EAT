import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AdminDropdownComponent } from 'src/app/component/admin-dropdown/admin-dropdown.component';


@Component({
  selector: 'app-viewaccount',
  templateUrl: './viewaccount.page.html',
  styleUrls: ['./viewaccount.page.scss'],
})
export class ViewaccountPage implements OnInit {
  userSubscription: Subscription;
  userData: any = [];
  currentRole: string;
  listed: boolean;
  editStamp_form: FormGroup; 
  editStamp: boolean;
  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController,
    private popoverCtrl: PopoverController, private fb: FormBuilder) {
      this.currentRole = 'vendor';

      


    this.userSubscription = this.userService.getAll(this.currentRole).subscribe((data) => {this.userData = data;});
   }

  ngOnInit() {
  }

  changeRole(role){
    //console.log(role.detail.value);
    this.currentRole = role.detail.value;
    this.editStamp = false;
    this.userSubscription = this.userService.getAll(this.currentRole).subscribe((data) => {this.userData = data;});
  }

  async presentPopover(ev, userid, listed, stamp) {
    //console.log(listed);
    //console.log(userid);
    //console.log(ev);
    const popover = await this.popoverCtrl.create({
      component: AdminDropdownComponent,
      event: ev,
      translucent: true,
      componentProps:{userid: userid, listed: listed, stamp: stamp},
      cssClass: 'admin-popover'
      
    });
    return await popover.present();
  }

  dismiss(){
    this.navCtrl.back();
  }

  ngOnDestroy(){
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

  openStampAlert(stamp){
    console.log(stamp);
    console.log("Stamp Open")
  }

  deductStamp(id, stamp){
    //console.log(stamp);
    stamp = stamp -1;
    console.log(stamp);
    this.userService.updateStamp(id, stamp).catch(err =>{
      this.showError(err);
    })
  }

  addStamp(id, stamp){
    
    stamp = stamp + 1
    console.log(stamp);
    this.userService.updateStamp(id, stamp).catch(err =>{
      this.showError(err);
    })
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }




  /*async alertWarning(email, listed){
    const alert = await this.alertCtrl.create({
      header:'Are you sure you want to unlist this account ' +"'" + email + "'" + "?",
      subHeader: 'Once unlisted, ' + "'" + email + "'" + "won't be able to login.",
      message: 'Decision can be reverted anytime.',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
            console.log("Change Listing to: " + listed);
           
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler:()=>{
            console.log("Cancel");
            
          }
        }
      ]
    });
  
    await alert.present();
  }*/

}
