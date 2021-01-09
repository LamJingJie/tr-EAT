import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signup_sponsor_form: FormGroup;
  customBackBtnSubscription: Subscription;
  role: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private toast: ToastController,
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private loading: LoadingController,
    private navCtrl: NavController) {

     

      this.signup_sponsor_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ])),
        password: new FormControl('',Validators.compose([
          Validators.minLength(7),
          Validators.required
        ])),
        confirmPassword: new FormControl('', Validators.compose([
          Validators.minLength(7),
          Validators.required
        ])),
      
      })


     }

  ngOnInit() {
  
   
  }


  get email(){
    return this.signup_sponsor_form.get('email');
  }
  get password(){
    return this.signup_sponsor_form.get('password');
  }
  get confirmPassword(){
    return this.signup_sponsor_form.get('confirmPassword');
  }


  async signup(){
    if(this.signup_sponsor_form.value['password'] == this.signup_sponsor_form.value['confirmPassword']){
      this.role = "sponsor";
      await this.presentLoadingSignUpSponsor();
    
      this.authService.SignUp(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['password'], this.role).then(async (res)=>{
           
        //console.log(res);
        //console.log("Successfully Signed Up");
        this.navCtrl.pop();
        this.signup_sponsor_form.reset();
        await this.loading.dismiss(null, null,"sponsorSignUp");
        await this.showMessage();
        
      }).catch(async (error)=>{
        //console.log(error.message);
        await this.loading.dismiss(null, null,"sponsorSignUp");
        this.showError("Error: " + error.message);
      });
    

    }else{
      this.passwordmatch();
    }

     //// console.log(this.signup_sponsor_form.value['role']);
      // this.userService.addSponsor(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['role']).then((res)=>{
     //   console.log(res);
   
      //console.log("REACHED");
    //  })

  }

  //If type password change to text, otherwise change to password
  showPassword1(val: any){
    //console.log(val);
    val.type = val.type == 'password' ? 'text' : 'password'
  }
  showPassword2(val: any){
    //console.log(val);
    val.type = val.type == 'password' ? 'text' : 'password'
  }

  async showMessage(){
    const toast = await this.toast.create({message: "Email Has Been Sent. Verify To Login.", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async passwordmatch(){
    const toast = await this.toast.create({message: "'Password' and 'Confirm Password' doesn't match.", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }


  
  async presentLoadingSignUpSponsor(){
    const loading2 = await this.loading.create({
      cssClass: 'my-custom-class',
      message:'Signing Up...',
      id: 'sponsorSignUp'
    });
    await loading2.present();

    console.log("Signing Up...");
  }


  

}
