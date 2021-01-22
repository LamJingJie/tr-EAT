import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, NavController, LoadingController } from '@ionic/angular'; 
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
  @Input() currentAcc: string;

  addfood_form: FormGroup; 
 
  selectedFile: any;
  filename: any;
  files: any;
  currentHalal: boolean;
  currentVeg: boolean;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder, private userService: UserService, private foodService: FoodService
    , private activatedRoute: ActivatedRoute, private navCtrl: NavController, private storage: AngularFireStorage,
    private toast: ToastController, private loading: LoadingController) {

      this.currentHalal = true;
      this.currentVeg = true;
      //console.log(this.currentVeg);

      this.addfood_form = this.fb.group({
        foodname: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        foodprice: new FormControl('',Validators.compose([
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
   
  }


  dismiss(){
    this.modalCtrl.dismiss();
  }
  changeHalal(halal){
    console.log(halal.detail.value);
    this.currentHalal = halal.detail.value;
  }

  changeVeg(veg){
    console.log(veg.detail.value);
    this.currentVeg = veg.detail.value;
  }

  //Upload Food Data into cloud firebase and storage
  async addFood(){
    await this.presentAddFoodLoading();
   // console.log(this.currentAcc)
   this.foodService.addFood(this.addfood_form.value['foodname'], this.addfood_form.value['foodprice'], this.currentHalal,
    this.currentAcc, this.currentVeg,this.selectedFile, this.filename).then(res=>{
      this.loading.dismiss(null,null,'addFoodAdmin');
      this.showSuccess();
      this.dismiss();
     
    }).catch((error)=>{
      this.loading.dismiss(null,null,'addFoodAdmin');
      this.showError(error);
    })
  }

  //Get Image Name
  onFileSelected(event){
    
    this.selectedFile = event.target.files[0];
    this.filename = event.target.files[0].name + event.timeStamp;
    //console.log(this.filename); 

    //Convert to base64 to then read in the html page and change prev image to current image. It will not be submitted yet just to
    //visualize what the image will look like.
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      me.files = reader.result;
     // console.log(me.files);
    };
    reader.onerror = function (error){
      console.log('Error: ', error);
    };
  }

  async presentAddFoodLoading(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Adding Food...',
      id: 'addFoodAdmin'
    });
    await loading.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

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
