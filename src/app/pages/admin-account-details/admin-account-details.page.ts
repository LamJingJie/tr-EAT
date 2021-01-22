import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController, LoadingController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-admin-account-details',
  templateUrl: './admin-account-details.page.html',
  styleUrls: ['./admin-account-details.page.scss'],
})
export class AdminAccountDetailsPage implements OnInit {
  currentAccount: string;
  userDetailsSubscription: Subscription;
  canteenSubscription: Subscription;
  userDetails: any = [];

  listed: boolean;
  currentRole: string;
  canteenData: any = [];
  currentMergedName: any;
  canteenChanged: any;
  editstall_form: FormGroup; 
  editedStall: boolean;

  selectedFile: any;
  filename: any;
  files: any;


  constructor(private activatedRoute: ActivatedRoute, private navCtrl:NavController, private userService: UserService,
    private router:Router, private alertCtrl: AlertController,public ngFireAuth: AngularFireAuth,
    private authService: AuthenticationService, private toast: ToastController, private loading: LoadingController,
    private canteenService: CanteenService, private fb: FormBuilder, private storage: Storage) {

      this.editedStall = false;
      
       //Edit Vendor Food Form
       this.editstall_form = this.fb.group({
        stallname: new FormControl('', Validators.compose([ 
          Validators.required
        ]))
      })
    
   }

 

   //Get Image Name
  changeImage(event, canteenid, stallname){
    console.log(canteenid);
    this.selectedFile = event.target.files[0];
    this.filename = event.target.files[0].name + event.timeStamp;

    //console.log(this.filename); 
    this.userService.updateStallImg(this.currentAccount, this.selectedFile, this.filename, this.userDetails.mergedName, canteenid, stallname)
    .then((res=>{
      this.UpdateshowSuccess_stallimage();
    })).catch((err=>{
      this.showError(err);
    }))

  //Convert to base64 to then read in the html page and change prev image to current image. It will not be submitted yet just to
  //visualize what the image will look like.
  /*let me = this;
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(){
    me.files = reader.result;
   // console.log(me.files);
  };
  reader.onerror = function (error){
    console.log('Error: ', error);
  };*/
}

  ngOnInit() {

    this.canteenSubscription = this.canteenService.getAll().subscribe((data)=>{
      this.canteenData = data;
      //console.log(this.canteenData);
    });

    let account = this.activatedRoute.snapshot.paramMap.get('account');
    this.currentAccount = account;

    this.userDetailsSubscription = this.userService.getOne(this.currentAccount).subscribe((data) => {
      this.userDetails = data;
      this.listed = this.userDetails.listed;
      this.currentRole = this.userDetails.role
      //console.log(this.listed);
    });

    
  }

  ionViewWillEnter(){
 
   
    
  }

  ionViewDidEnter(){
    
    //console.log(this.userDetails);
  }

  //Canteen will change everytime user clicks on a new canteen
  changeCanteen(canteen){
    //console.log(canteen.detail.value);
    this.canteenChanged = canteen.detail.value;
    this.userService.updateCanteen(this.currentAccount, this.canteenChanged).then(res=>{
      this.UpdateshowSuccess_canteen();
    }).catch(err =>{
      this.showError(err);
    })
  }
  
  editStallName(){
    this.editedStall = true;
  }

  editStall(){
    //console.log(this.editstall_form.value['stallname']);
    this.userService.updateStallName(this.currentAccount, this.editstall_form.value['stallname']).then(res=>{
      this.editedStall = false;
      this.UpdateshowSuccess_stallname();
    }).catch(err=>{
      this.showError(err);
    })
  }


  dismiss(){
    this.navCtrl.pop();
  }

  ngOnDestroy(){
    if(this.userDetailsSubscription){
      this.userDetailsSubscription.unsubscribe();
    }
    if(this.canteenSubscription){
      this.canteenSubscription.unsubscribe();
    }
  }

  async deleteAccPopUp(){
    const alert = await this.alertCtrl.create({
      header:'Delete Account',
      subHeader:'Decision is irreversible',
      message:'Note: Everything relating to the account will be deleted',
      inputs:[
        {
          type:'password',
          name: 'password',
          placeholder: 'Provide deleting account password',
          id:'deleteAccountPassword'
        }
      ],
      buttons:[
        {
          text: 'Delete',
          handler: async password=>{
              
              //console.log(password.password);
              //console.log(this.currentAccount);
              if(password.password != ""){
                await this.presentDelAccLoad();
              
                await this.authService.deleteUserAdmin(this.currentAccount, password.password, this.currentRole).then(async res =>{
                //  console.log(res);
                
                this.loading.dismiss(null,null,'deleteAccount');
                this.dismiss();
                this.DeleteshowSuccess_account();
              }).catch(async (err)=>{
                
                this.loading.dismiss(null,null,'deleteAccount');
                this.showError(err);
              });
              
              }
              
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler:()=>{
            console.log("Cancel");
            
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentDelAccLoad(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Deleting...',
      id: 'deleteAccount'
    });
    await loading.present();
  }

  async DeleteshowSuccess_account(){
    const toast = await this.toast.create({message: "Account and anything related to it has been deleted", position: 'bottom', duration: 2000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async UpdateshowSuccess_canteen(){
    const toast = await this.toast.create({message: "Canteen Updated", position: 'bottom', duration: 1000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async UpdateshowSuccess_stallname(){
    const toast = await this.toast.create({message: "Stall Updated", position: 'bottom', duration: 1000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async UpdateshowSuccess_stallimage(){
    const toast = await this.toast.create({message: "Stall Image Updated", position: 'bottom', duration: 1000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }


  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

}
