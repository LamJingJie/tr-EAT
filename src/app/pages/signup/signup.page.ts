import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signup_sponsor_form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private toast: ToastController,
    private router: Router,
    private navCtrl: NavController) {

      this.signup_sponsor_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          Validators.email
        ])),
        password: new FormControl('',Validators.compose([
          Validators.minLength(7),
          Validators.required
        ])),
        confirmPassword: new FormControl('', Validators.compose([
          Validators.minLength(7),
          Validators.required
        ])),
        role: new FormControl('sponsor', Validators.compose([
          Validators.minLength(1)
        ]))

      
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


   signup(){

     // console.log(this.signup_sponsor_form.value['role']);
      // this.userService.addSponsor(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['role']).then((res)=>{
     //   console.log(res);
         this.authService.SignUp(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['password'], this.signup_sponsor_form.value['role']).then(async (res)=>{
         
          //console.log(res);
          //console.log("Successfully Signed Up");
         this.signup_sponsor_form.reset();
 
        }).catch((error)=>{
          //console.log(error.message);
           this.showError("Error: " + error.message);
        })
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

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  

}
