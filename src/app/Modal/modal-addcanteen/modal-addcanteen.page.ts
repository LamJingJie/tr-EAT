import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import '@simonwep/pickr/dist/themes/classic.min.css';   // 'classic' theme
import '@simonwep/pickr/dist/themes/monolith.min.css';  // 'monolith' theme
import '@simonwep/pickr/dist/themes/nano.min.css';      // 'nano' theme
import Pickr from '@simonwep/pickr';

//Database Imports
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

//Services Imports
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-modal-addcanteen',
  templateUrl: './modal-addcanteen.page.html',
  styleUrls: ['./modal-addcanteen.page.scss'],
})

export class ModalAddcanteenPage implements OnInit {

  canteen: any = [];
  currentAccount: string;
  canteenForm: FormGroup;
  selectedFile: any;
  filename: any;
  files: any;
  colorChose: any;
  colorLoop: any;

  sliderConfig = {
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: false,
    slidesPerView: 2.5,
    roundLengths: true
  }
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private canteenService: CanteenService,
    private toast: ToastController,
    private loading: LoadingController,
  ) {
    this.canteenForm = this.formBuilder.group({
      canteenname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      canteenimage: new FormControl('',Validators.compose([
  
      ])),

    })
  
  }

  ngOnInit() {
    // Check if user is logged in
    // this.fireAuth.onAuthStateChanged((user) => {
    //   if (user) {
    //   }
    //   else {
    //     // Push user back to login
    //     this.router.navigate(["/login"]);
    //   }
    // });

    //Code for Color Picker, chooses the theme that will be displayed in the firestore 
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
      //console.log(this.colorChose);
      //(<HTMLElement>document.querySelector('.colorshown')).style.setProperty('--background', this.colorChose);
      pickr.hide();
    });

  }

  //This function is to get image from files and post it on the modal in the AddCanteen 
  //Get Image Name
  /*
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.filename = event.target.files[0].name + event.timeStamp;
    //console.log(this.filename); 

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

  //Function synced from canteenService, posts the data to firestore 
  async submitCanteen(data) {
    //console.log(this.colorChose);
    if(this.colorChose !== undefined){
      //console.log('not empty')
      await this.startLoader();
      this.canteenService.addCanteen(
        data.value.canteenname,
        this.colorChose,
      ).then(res => {
        this.loading.dismiss(null, null, 'addCanteenAdmin');
        this.showSuccess();
        this.dismiss();
  
      }).catch((error) => {
        this.loading.dismiss(null, null, 'addCanteenAdmin');
        this.showError(error);
      })
    }else{
      this.showMessage("Color not chosen!");
    }
   
  }

  // Loader for on submit canteen
  async startLoader() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Adding Canteen...',
      id: 'addCanteenAdmin'
    });
    await loading.present();
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
  dismiss() {
    this.modalController.dismiss()
  }

  async showMessage(msg){
    const toast = await this.toast.create({message: msg, position: 'bottom', duration: 3000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }
}