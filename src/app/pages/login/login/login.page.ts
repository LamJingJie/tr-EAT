import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService, User } from 'src/app/services/user/user.service';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login_form: FormGroup; 
  newUser: User = <User>{}
  gettingRoleSubscription: Subscription;

  constructor(private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private userService: UserService,
    private canteenService: CanteenService,
    private toast: ToastController,
    private navCtrl: NavController) {

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


   login(){
     this.gettingRoleSubscription =  this.userService.getOne(this.login_form.value['email']).subscribe((roles) =>{
      //console.log("AHH: " + roles['role']);
      this.authService.SignIn(this.login_form.value['email'], this.login_form.value['password'], roles['role']).then((res) => {
        //this.userService.getOne(this.login_form.value['email']).subscribe((res) =>{
        //  console.log(res['role']);
         /* const data = {email: this.login_form.value['email'],role: res['role']};
          this.newUser = data;
          console.log("new user login: " +this.newUser);
          this.userService.addUser(this.newUser).then(item => {
            this.newUser = <User>{}
            console.log(item + ' insert');
           
            //this.router.navigateByUrl('/tabs');
        
            });     */
  
       //     this.authService.setUserData(this.login_form.value['email'],res['role']);
       //     this.login_form.reset();
        //  this.router.navigateByUrl('/tabs');
      //  });
  
      this.login_form.reset();
     // console.log("Return Login Page: " + JSON.stringify(res));
        
       // this.authService.setUserData(this.login_form.value);
     //   this.router.navigateByUrl("");
      }).catch((error) => {
        this.showError("Login Page Error: " + error.message);
      });
      this.gettingRoleSubscription.unsubscribe();
    });
    
  //  console.log(this.login_form.value);
  }


  goSignUp(){
    this.router.navigate(['signup']);
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
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

}