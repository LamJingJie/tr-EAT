import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController, LoadingController, NavController, NavParams, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-admin-dropdown',
  templateUrl: './admin-dropdown.component.html',
  styleUrls: ['./admin-dropdown.component.scss'],
  
})

@NgModule({
  imports: [CommonModule],
  declarations: [AdminDropdownComponent]
})

export class AdminDropdownComponent implements OnInit {
  user: string;
  listed: boolean;
  stamp: number;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, 
    private navCtrl:NavController, private alertCtrl: AlertController, private toast: ToastController, private navParams: NavParams,
    private popoverCtrl: PopoverController) { 
    this.user = this.navParams.get('userid');
    this.listed = this.navParams.get('listed');
    this.stamp = this.navParams.get('stamp');
    //console.log(this.user);
  }

  ngOnInit() {}

  unlistAcc(){
     //console.log(listed);
    //console.log(listing.detail.value);
    //console.log(listing);
    //this.listed = listing.detail.value;
    //console.log(this.listed);

    if(this.listed === true){
      this.listed = false;
      //console.log("True: " + listed);
      this.userService.updateListing(this.user, this.listed);
      this.changedListingMessage("'" + this.user + "'" + " has been unlisted.");
    }else{
      //console.log("Not true")
      this.listed = true;
      //console.log("Not true: " + listed);
      this.userService.updateListing(this.user, this.listed);
      this.changedListingMessage("'" + this.user + "'" + " has been listed.");
    }
    this.popoverClose();
  }

  popoverClose(){
    this.popoverCtrl.dismiss();
  }

  async changedListingMessage(msg){
    const toast = await this.toast.create({message: msg, position: 'bottom', duration: 1000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

}
