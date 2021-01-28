import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Service imports
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { CanteenService } from 'src/app/services/canteen/canteen.service';

// Database imports
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Modals inport
import { ModalAddcanteenPage } from 'src/app/Modal/modal-addcanteen/modal-addcanteen.page';
import { ModalEditdelcanteenPage } from 'src/app/Modal/modal-editdelcanteen/modal-editdelcanteen.page';



@Component({
  selector: 'app-addcanteen',
  templateUrl: 'addcanteen.page.html',
  styleUrls: ['addcanteen.page.scss']
})

export class AddcanteenPage {
  //users: User[] = [];
  userRole: any;
  userEmail: any;
  test: any;
  canteenSub: Subscription;
  customBackBtnSubscription: Subscription;
  canteen: any = [];
  data: boolean;


  constructor(
    private canteenService: CanteenService,
    private alertController: AlertController,
    private router: Router,
    public authService: AuthenticationService,
    private userService: UserService,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private storage: Storage, private http: HttpClient,
    private platform: Platform, private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private toast: ToastController,
    private loading: LoadingController
  ) {
    this.data = true;
    this.canteenSub = canteenService.getAll().subscribe((data) => { this.canteen = data; });
  }

  ngOnInit() {
  }

  changeCanteenPopUp(id, deleted){
    deleted = !deleted 
    this.canteenService.Update(id,deleted)
  } 


  // Open up add canteen modal
  async addCanteen() {
    const modal = await this.modalController.create({
      component: ModalAddcanteenPage,
    });
    return await modal.present();
  }
  // Open up edit canteen modal
  async editCanteen(id) {
    const modal = await this.modalController.create({
      component: ModalEditdelcanteenPage,
      componentProps: {
        // Sends data to the model
        id: id,
      },
    });
    return await modal.present();
  }

  

  async deleteCanteen(id, mergedName) {
    await this.presentDelCanteen();
    this.canteenService.deleteCanteen(id, mergedName).then(async res => {
      await this.loading.dismiss(null, null, 'delCanteenAdmin');
      this.showSuccess();
    }).catch(async (error) => {
      await this.loading.dismiss(null, null, 'delCanteenAdmin');
      this.showError(error);
    })
  }

  async deleteCanteenPopUp(id, mergedName) {
    const alert1 = await this.alertCtrl.create({
      message: 'Are you sure you want to delete this canteen?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteCanteen(id, mergedName);
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });

    await alert1.present();
  }

  dismiss() {
    this.navCtrl.back();
  }

  async presentDelCanteen() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Deleting Canteen...',
      id: 'delCanteenAdmin'
    });
    await loading.present();
    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it
  }

  ngOnDestroy() {
    if (this.canteenSub) {
      this.canteenSub.unsubscribe();
    }
  }

  async showSuccess() {
    const toast = await this.toast.create({
      message: "Canteen Deleted!",
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