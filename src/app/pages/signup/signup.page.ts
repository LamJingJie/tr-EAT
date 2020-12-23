import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';


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
    private userService: UserService,) {

      this.signup_sponsor_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
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

  signup(){

      console.log(this.signup_sponsor_form.value);
       this.authService.SignUp(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['password']).then((res)=>{
         this.userService.addSponsor(this.signup_sponsor_form.value['email'], this.signup_sponsor_form.value['role']);
         console.log(res);
         console.log("Successfully Signed Up");
       }).catch((error)=>{
         console.log(error.message);
       })

  
  }

}
