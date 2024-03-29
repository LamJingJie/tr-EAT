import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { ModalAddfoodPage } from 'src/app/Modal/modal-addfood/modal-addfood.page';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-modal-editdelfood',
  templateUrl: './modal-editdelfood.page.html',
  styleUrls: ['./modal-editdelfood.page.scss'],
})
export class ModalEditdelfoodPage implements OnInit {

@Input() foodid: string;

image: string;
id: string;
foodData: any = [];

currentHalal: boolean;
currentVeg: boolean;

filestring: string;
selectedFile: any;
filename: any;
files: any;

editfood_form: FormGroup; 
foodSubscription: Subscription;
  currentCuisine: any;
  constructor(private activatedRoute: ActivatedRoute, private fb:FormBuilder, private navCtrl:NavController, private loading: LoadingController
    , private foodService: FoodService, private toast: ToastController, public ngFireAuth: AngularFireAuth,private modalCtrl: ModalController, private alertController: AlertController) { 

       //Edit Vendor Food Form
       this.editfood_form = this.fb.group({
        foodname: new FormControl('', Validators.compose([ 
          Validators.required
        ])),
        foodprice: new FormControl('',Validators.compose([ 
          Validators.required
        ])),
        availquantity: new FormControl('',Validators.compose([ 
          Validators.required
        ])),
        halal: new FormControl('',Validators.compose([ 
          Validators.required
        ])),
        vegetarian: new FormControl('',Validators.compose([ 
          Validators.required
        ])),
        mergedName: new FormControl('',Validators.compose([ 
          Validators.required
        ]))
     
      })

  }

  ngOnDestroy(){

    if(this.foodSubscription){
      this.foodSubscription.unsubscribe();
    }
    
  }

  ngOnInit() {
     //Get data passed from url
    //console.log(this.foodid);

    this.foodSubscription = this.foodService.getFoodById(this.foodid).subscribe(res =>{
      this.foodData = res;
      this.currentHalal = this.foodData.halal;
      this.currentVeg = this.foodData.vegetarian;
      this.currentCuisine = this.foodData.cuisinename;
      //console.log(this.foodData);
      this.foodSubscription.unsubscribe(); //Prevent constant refresh by students or sponsors due to the constant updates to the db
    });
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  async editFood(){
   
    await this.presentEditFoodLoading();
    
    //Check if there is any data inside those 2 variables. If there is data, it will imply that they have selected an image for update
    if(this.image == null && this.filename == null){
   //   console.log(this.editfood_form.value['foodname']);
    //  console.log(this.currentHalal);
    //  console.log(this.currentVeg);
    //  console.log(this.foodData.userid);
    //  console.log(this.id);
    //console.log("EMPTY IMAGE");
      this.foodService.editFoodNoImg(this.editfood_form.value['foodname'], this.editfood_form.value['foodprice'], this.editfood_form.value['availquantity'],
      this.editfood_form.value['halal'], this.editfood_form.value['vegetarian'], this.foodData.userid, this.foodid, this.currentCuisine)
      .then(res=>{
        this.loading.dismiss(null, null, 'editFoodAdmin');
        this.dismiss();
        this.showSuccess();
      }).catch((err)=>{
        this.loading.dismiss(null, null, 'editFoodAdmin');
        this.dismiss();
        this.showError(err);
      })

    }else{
      //console.log("IMAGE");
    //  console.log(this.editfood_form.value['foodname']);
    //  console.log(this.currentHalal);
   //   console.log(this.currentVeg);
    //  console.log(this.foodData.userid);
     // console.log(this.id);
      this.foodService.editFoodWithImg(this.editfood_form.value['foodname'], this.editfood_form.value['foodprice'], this.editfood_form.value['availquantity'],
      this.editfood_form.value['halal'], this.editfood_form.value['vegetarian'], this.foodData.userid, this.foodid, this.image, this.filename, this.editfood_form.value['mergedName'], this.currentCuisine)
      .then(res=>{
        this.loading.dismiss(null, null, 'editFoodAdmin');
        this.dismiss();
        this.showSuccess();
      }).catch((err)=>{
        this.loading.dismiss(null, null, 'editFoodAdmin');
        this.dismiss();
        this.showError(err);
      })
    }
  }

  //Changes Start
  async selectCuisine() {
    const alert = this.alertController
      .create({
        
        header: "Select Cuisine:",
        inputs: [{
          name: 'box 1',
          type: 'checkbox',
          label: 'Asian',
          value: 'Asian',
          checked: false, 
        },
        {
          name: 'box 2',
          type: 'checkbox',
          label: 'Western',
          value: 'Western',
          checked: false, 
        },
        {
          name: 'box 3',
          type: 'checkbox',
          label: 'Malay',
          value: 'Malay',
          checked: false, 
        },
        {
          name: 'box 4',
          type: 'checkbox',
          label: 'Others',
          value: 'Others',
          checked: false, 
        },
      ],
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Confirm",
            handler: (alertData) => {
              this.currentCuisine = alertData
              
              console.log(alertData)  
              
            },
          },
        ],
      })

      .then((alert) => alert.present());
      }

      //Changes END

  onFileSelected(event){
    //Main section to be used when editing
    this.image = event.target.files[0];
    this.filename = event.target.files[0].name + event.timeStamp;
    //console.log(this.image); 

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

  async presentEditFoodLoading(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Updating...',
      id: 'editFoodAdmin'
    });
    await loading.present();
  }

 
  

  async showSuccess(){
    const toast = await this.toast.create({message: "Food Updated!", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }
  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }

}
