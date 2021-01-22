import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private canteenService: CanteenService,
    private toast: ToastController,
    private loading: LoadingController,
  ) {
    this.canteenForm = this.formBuilder.group({
      canteenname: "",
      canteenimage: "",
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
  }

  //Get Image Name
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
  }


  async submitCanteen(data) {
    await this.startLoader();
    this.canteenService.addCanteen(
      data.value.canteenname,
      this.selectedFile,
      uuidv4(),
      this.filename
    ).then(res => {
      this.loading.dismiss(null, null, 'addCanteenAdmin');
      this.showSuccess();
      this.dismiss();

    }).catch((error) => {
      this.loading.dismiss(null, null, 'addCanteenAdmin');
      this.showError(error);
    })
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
}