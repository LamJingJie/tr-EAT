import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-modal-addvendor',
  templateUrl: './modal-addvendor.page.html',
  styleUrls: ['./modal-addvendor.page.scss'],
})
export class ModalAddvendorPage implements OnInit {
  adduser_form: FormGroup; 
  addstudent_form: FormGroup;

  addingVendorSubscription: Subscription;
  canteenData: any = [];
  currentRole: string;

  canteenSubscription: Subscription

  constructor(private modalCtrl: ModalController,  private fb: FormBuilder,private authService: AuthenticationService,
    private toast: ToastController, private canteenService: CanteenService, private navCtrl: NavController, private loading: LoadingController,
    private storage: Storage) { 


      this.currentRole = 'vendor';


      this.canteenSubscription = this.canteenService.getAll().subscribe((data) => {this.canteenData = data;});


      //Vendor Form
    this.adduser_form = this.fb.group({
      email: new FormControl('', Validators.compose([ //Vendor
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
      ])),
      password: new FormControl('',Validators.compose([ //Vendor
        Validators.minLength(7),
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([ //Vendor
        Validators.minLength(7),
        Validators.required
      ])),
      canteen: new FormControl('',Validators.compose([ //Vendor
        Validators.required
      ])),
      stallname: new FormControl('',Validators.compose([ //Vendor
        Validators.required
      ])),
    })


    //Student Form
    this.addstudent_form = this.fb.group({
      email1: new FormControl('', Validators.compose([ //Student
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
      ])),
      password1: new FormControl('',Validators.compose([ //Student
        Validators.minLength(7),
        Validators.required
      ])),
      confirmPassword1: new FormControl('', Validators.compose([ //Student
        Validators.minLength(7),
        Validators.required
      ])),
      stamp: new FormControl('',Validators.compose([ //Student
        Validators.required
      ]))
    })
  }

  changeRole(role){
    console.log(role.detail.value);
    this.currentRole = role.detail.value;
  }

  //Vendor
  get email(){
    return this.adduser_form.get('email');
  }
  get password(){
    return this.adduser_form.get('password');
  }
  get confirmPassword(){
    return this.adduser_form.get('confirmPassword');
  }
  get canteen(){
    return this.adduser_form.get('canteen');
  }
  get stallname(){
    return this.adduser_form.get('stallname');
  }


  //Student
  get email1(){
    return this.addstudent_form.get('email1');
  }
  get password1(){
    return this.addstudent_form.get('password1');
  }
  get confirmPassword1(){
    return this.addstudent_form.get('confirmPassword1');
  }
  get stamp(){
    return this.addstudent_form.get('stamp');
  }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  async addVendor(){
    if(this.adduser_form.value['password'] == this.adduser_form.value['confirmPassword']){
      // console.log(this.adduser_form.value['email']);
      // console.log(this.adduser_form.value['password']);
      //console.log(this.adduser_form.value['canteen']);
      // console.log(this.adduser_form.value['stallname']);
      // console.log(this.currentRole);
      //console.log(this.adduser_form.value['stamp']);

      await this.presentLoadingSignUpAdmin();

      await this.authService.SignUpVendor(this.adduser_form.value['email'], this.adduser_form.value['password'], this.adduser_form.value['canteen'], this.adduser_form.value['stallname'], this.currentRole).then(async (res)=>{
      await this.adduser_form.reset();
      //console.log(res);
 
      console.log("Done!");
      this.loading.dismiss(null, null, 'adminSignUp');
      this.dismiss();
      await this.showToast();
      
      }).catch(async (error)=>{

      this.loading.dismiss(null, null, 'adminSignUp');
      this.showError("Error: " + error.message);
    });
    }else{
      this.passwordmatch();
    }
  
  }

  async addStudent(){
  if(this.addstudent_form.value['password1'] == this.addstudent_form.value['confirmPassword1']){
    // console.log(this.addstudent_form.value['email1']);
    // console.log(this.addstudent_form.value['password1']);
    // console.log(this.addstudent_form.value['stamp']);
    // console.log(this.currentRole);
    await this.presentLoadingSignUpAdmin();
    
    await this.authService.SignUpStudent(this.addstudent_form.value['email1'], this.addstudent_form.value['password1'],this.addstudent_form.value['stamp'] , this.currentRole).then(async (res)=>{
      await this.addstudent_form.reset();
     
      this.loading.dismiss(null, null, 'adminSignUp');
      this.dismiss();
      await this.showToast();

    }).catch(async (error)=>{
      
      this.loading.dismiss(null, null, 'adminSignUp');
      this.showError("Error: " + error.message);

   });
   
  }else{
    this.passwordmatch();
  }
  
}

  async passwordmatch(){
    const toast = await this.toast.create({message: "Password and Confirm Password doesn't match.", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

  async showToast(){
    const toast = await this.toast.create({message: "Account Added! Verification Email Has Been Sent.", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
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
   //If type password change to text, otherwise change to password
   showPassword3(val: any){
    //console.log(val);
    val.type = val.type == 'password' ? 'text' : 'password'
  }
  showPassword4(val: any){
    //console.log(val);
    val.type = val.type == 'password' ? 'text' : 'password'
  }

  ngOnDestroy(){
    if(this.canteenSubscription){
      this.canteenSubscription.unsubscribe();
    }
  }

  async presentLoadingSignUpAdmin(){
    const loading1 = await this.loading.create({
      cssClass: 'my-custom-class',
      message:'Adding...',
      id: 'adminSignUp'
    });
    await loading1.present();

    console.log("Adding...");
  }




}
