import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-modal-addfood',
  templateUrl: './modal-addfood.page.html',
  styleUrls: ['./modal-addfood.page.scss'],
})
export class ModalAddfoodPage implements OnInit {
  currentAccount: string;
  addfood_form: FormGroup; 
 
  selectedFile: any;
  filename: any;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder, private userService: UserService, private foodService: FoodService
    , private activatedRoute: ActivatedRoute, private navCtrl: NavController, private storage: AngularFireStorage,
    private toast: ToastController) {

      this.addfood_form = this.fb.group({
        foodname: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        foodprice: new FormControl('',Validators.compose([
          Validators.required
        ])),
        halal: new FormControl('',Validators.compose([
          Validators.required
        ])),
        vegetarian: new FormControl('',Validators.compose([
          Validators.required
        ])),
        foodimage: new FormControl('',Validators.compose([
          Validators.required
        ]))
      })
     

   }

   get foodname(){
    return this.addfood_form.get('foodname');
  }
  get foodprice(){
    return this.addfood_form.get('foodprice');
  }

  ngOnInit() {
    //Get data passed from url
    let account = this.activatedRoute.snapshot.paramMap.get('account');
    this.currentAccount = account;
    console.log(account);
  }


  dismiss(){
    this.navCtrl.pop();
  }

  //Upload Food Data into cloud firebase and storage
  addFood(){
   this.foodService.addFood(this.addfood_form.value['foodname'], this.addfood_form.value['foodprice'], this.addfood_form.value['halal'],
    this.currentAccount, this.addfood_form.value['vegetarian'],this.selectedFile, this.filename).then(res=>{
      this.showSuccess();
    }).catch((error)=>{
      this.showError(error);
    })
  }

  //Get Image Name
  onFileSelected(event){
    
    this.selectedFile = event.target.files[0];
    this.filename = event.target.files[0].name;
    console.log(this.selectedFile);
  }

  async showSuccess(){
    const toast = await this.toast.create({message: "Food Added!", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }
  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

}
