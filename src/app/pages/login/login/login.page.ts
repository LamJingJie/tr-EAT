import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login_form: FormGroup; 
  //newUser: User = <User>{}
  gettingRoleSubscription: Subscription;
  customBackBtnSubscription: Subscription;
  constructor(private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private userService: UserService,
    private canteenService: CanteenService,
    private toast: ToastController,
    private loading: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform) {

      this.login_form = this.fb.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
        ])),
        password: new FormControl('',Validators.compose([
          Validators.minLength(7),
          Validators.required
        ]))
      })
     
     }

  ngOnInit() {
    //this.authService.checkAuth();
  }
  ionViewWillEnter(){
    if (this.platform.is('android')) { 
      this.customBackBtnSubscription = this.platform.backButton.subscribeWithPriority(601,() => {
        this.leavePopup();
      });
    }
  }

  ionViewDidEnter(){
   
  }

  ionViewWillLeave(){
    if (this.platform.is('android')) {
      if(this.customBackBtnSubscription){
        this.customBackBtnSubscription.unsubscribe();
      }   
    } 
    this.login_form.reset();
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

  get email(){
    return this.login_form.get('email');
  }
  get password(){
    return this.login_form.get('password');
  }

  //If type password change to text, otherwise change to password
  showPassword1(val: any){
    val.type = val.type == 'password' ? 'text' : 'password' 
  }


   async login(){
     await this.presentLoadingLogin();
     
     this.gettingRoleSubscription = await this.userService.getOne(this.login_form.value['email']).subscribe(async (data) =>{
      //console.log("AHH: " + roles['role']);
      if(data['listed'] === true){
        await this.authService.SignIn(this.login_form.value['email'], this.login_form.value['password'], data['role']).then((res) => {

          this.loading.dismiss(null,null,'loginUser');
          

          }).catch((error) => {
            this.loading.dismiss(null,null,'loginUser');
            this.showError("Error: " + error.message);
          });
          
      }else{
        console.log("Unlisted");
        this.loading.dismiss(null,null,'loginUser');
        this.notlisted();
        
      }
     
      this.gettingRoleSubscription.unsubscribe();
    });
   
  }


  goSignUp(){
    this.router.navigateByUrl("signup");
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async notlisted(){
    const toast = await this.toast.create({message: "Account has been unlisted", position: 'bottom', duration: 5000,buttons: [ { text: 'ok' } ]});
    toast.present();
  }

  //Code will be executed just before the instance of the component is finally destroyed, perfect place to clean the component
  //Example: to cancel background tasks
  ngOnDestroy(){
    if(this.gettingRoleSubscription){
      this.gettingRoleSubscription.unsubscribe();
    }
    
    //console.log("test");
  }

  async presentLoadingLogin(){
    const loading3 = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Logging in...',
      id: 'loginUser'
    });
    await loading3.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

    console.log("Logging In...");
  }

}
