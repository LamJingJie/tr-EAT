import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import Pickr from '@simonwep/pickr';

//Database Imports
import { Subscription } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";

//Modal Imports 
import { ModalAddfoodPage } from 'src/app/Modal/modal-addfood/modal-addfood.page';

//Service Imports
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-modal-editdelcanteen',
  templateUrl: './modal-editdelcanteen.page.html',
  styleUrls: ['./modal-editdelcanteen.page.scss'],
})
export class ModalEditdelcanteenPage implements OnInit {

  @Input() id: any;
  image: string;
  canteen: any = [];
  colorChose: any;
  colorLoop: any;

  filestring: string;
  selectedFile: any;
  filename: any;
  files: any;
  oldImage: any;
  editcanteen_form: FormGroup;
  canteenSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private loading: LoadingController,
    private canteenService: CanteenService,
    private toast: ToastController,
    public ngFireAuth: AngularFireAuth,
    private modalController: ModalController,
  ) {  //Edit canteen 
    this.editcanteen_form = this.fb.group({
      canteenname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      mergedName: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  ngOnDestroy() {
    if (this.canteenSubscription) {
      this.canteenSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    //Get data passed from url
    this.canteenSubscription = this.canteenService.getCanteenbyid(this.id).subscribe(res => {
      this.canteen = res;
      this.oldImage = this.canteen.mergedname
      //console.log(this.canteen);
    });

    const pickr = Pickr.create({
      el: '.color-picker',
      theme: 'classic', // or 'monolith', or 'nano'

      components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: false,
          save: true
        }
      }
    });

    //await pickr.show();

    //Instances on when the color picker is opened
    pickr.on('save', (...args) => {
      let colorChosen = args[0].toRGBA();

      this.colorChose = colorChosen.toString();
      console.log(this.colorChose);
      //(<HTMLElement>document.querySelector('.colorshown')).style.setProperty('--background', this.colorChose);
      pickr.hide();
    });


  }

  //Function that changes the different fields in the database
  async editCanteen() {
    await this.presentEditCanteenLoading();
    this.canteenService.editCanteenWithColour(
      this.editcanteen_form.value['canteenname'],
      this.id,
      this.image,
      this.filename,
      this.oldImage,
      this.colorChose,
    )
      .then(res => {
        this.loading.dismiss(null, null, 'editCanteenAdmin');
        this.dismiss();
        this.showSuccess();
      }).catch((err) => {
        this.loading.dismiss(null, null, 'editCanteenAdmin');
        this.dismiss();
        this.showError(err);
      })

    //Check if there is any data inside those 2 variables. If there is data, it will imply that they have selected an image for update
    if (!this.image || !this.filename) {
      //  console.log(this.editfood_form.value['foodname']);
      //  console.log(this.currentHalal);
      //  console.log(this.currentVeg);
      //  console.log(this.foodData.userid);
      //  console.log(this.id);
      this.canteenService.editCanteenNoImg(this.editcanteen_form.value['canteenname'], this.id)
        .then(res => {
          this.loading.dismiss(null, null, 'editCanteenAdmin');
          this.dismiss();
          this.showSuccess();
        }).catch((err) => {
          this.loading.dismiss(null, null, 'editCanteenAdmin');
          this.dismiss();
          this.showError(err);
        })

    } else {
      console.log("IMAGE");
      //  console.log(this.editfood_form.value['foodname']);
      //  console.log(this.currentHalal);
      //   console.log(this.currentVeg);
      //  console.log(this.foodData.userid);
      // console.log(this.id);

    }
  }

  /* This function is to edit or delete image from files 
  onFileSelected(event) {
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
    reader.onload = function () {
      me.files = reader.result;
      // console.log(me.files);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }*/

  async presentEditCanteenLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Updating...',
      id: 'editCanteenAdmin'
    });
    await loading.present();
  }


  dismiss() {
    this.modalController.dismiss()
  }

  async showSuccess() {
    const toast = await this.toast.create({
      message: "Canteen Updated!",
      position: 'bottom',
      duration: 5000,
      buttons: [{
        text: 'ok',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    toast.present();
  }
  async showError(error) {
    const toast = await this.toast.create({
      message: error,
      position: 'bottom',
      duration: 5000,
      buttons: [{
        text: 'ok',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    toast.present();
  }


}
