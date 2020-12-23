import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login_form: FormGroup;

  constructor(private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private userService: UserService,
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
    this.router.navigateByUrl("");
  //  console.log(this.login_form.value);
  }

  goSignUp(){
    this.router.navigate(['signup']);
  }

}
