import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { ModalAddfoodPage } from 'src/app/Modal/modal-addfood/modal-addfood.page';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { ModalEditdelfoodPage } from 'src/app/Modal/modal-editdelfood/modal-editdelfood.page';

@Component({
  selector: 'app-adminfood',
  templateUrl: './adminfood.page.html',
  styleUrls: ['./adminfood.page.scss'],
})
export class AdminfoodPage implements OnInit {
  vendorSubscription: Subscription;
  foodSubscription: Subscription;
  vendoracc: any = [];
  foodData: any = [];
  currentAcc: string;


  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthenticationService, private foodService: FoodService,
    private modalCtrl: ModalController, private router: Router, private navCtrl: NavController, private activatedRoute:ActivatedRoute,
    private alertCtrl: AlertController, private loading: LoadingController, private toast: ToastController) {

  
   }

   ngOnInit(){
      let account = this.activatedRoute.snapshot.paramMap.get('account');
      this.currentAcc = account;
   }
    ionViewWillEnter(){
    
     // console.log(this.currentAcc)
    this.foodSubscription = this.foodService.getRespectiveFood(this.currentAcc).subscribe((res)=>{
      //console.log(res);
      this.foodData = res;

      this.foodSubscription.unsubscribe();//prevent constant refreshing becuase of the students or sponsors
    })
   }

   ionViewDidEnter(){
   
   }

   async editFood(foodid){
     //[routerLink]="['/modal-editdelfood', food.id]"
     const modal = await this.modalCtrl.create({
      component: ModalEditdelfoodPage,
      componentProps:{
        'foodid': foodid,
      },
      cssClass: 'modal_editfood_class'
    });

     await modal.present();

     await modal.onWillDismiss().then((res=>{
      this.ionViewWillEnter(); //refresh
      }));
  
   }

   async addFood(){
     //[routerLink]="['/modal-addfood', currentAcc]"
     const modal = await this.modalCtrl.create({
      component: ModalAddfoodPage,
      componentProps:{
        'currentAcc': this.currentAcc,
      },
      cssClass: 'modal_addfood_class'
    });
     await modal.present();

     await modal.onWillDismiss().then((res=>{
      this.ionViewWillEnter(); //refresh
      }));
   }

  

   async deleteFood(id, mergedName){

     await this.presentDelFood();
    this.foodService.deleteFood(id, mergedName).then(async res =>{
      this.ionViewWillEnter();
      await this.loading.dismiss(null, null, 'delFoodAdmin');
      this.showSuccess();
     }).catch(async (error) =>{
      await this.loading.dismiss(null, null, 'delFoodAdmin');
       this.showError(error);
     })

   }

   async deleteFoodPopUp(id, name, mergedName){
    
    const alert1 = await this.alertCtrl.create({
      message: 'Are you sure you want to delete ' + '"'+ name + '"' + '?',
      buttons:[
        {
          text: 'Yes',
          handler:()=>{
            this.deleteFood(id, mergedName);
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

  dismiss(){
    this.navCtrl.pop();
  }

  async presentDelFood(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Deleting Food...',
      id: 'delFoodAdmin'
    });
    await loading.present();

    //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

  }



  ngOnDestroy(){

    if(this.foodSubscription){
      this.foodSubscription.unsubscribe();
    }
  }

  async showSuccess(){
    const toast = await this.toast.create({message: "Food Deleted!", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }
  async showError(error){
    const toast = await this.toast.create({message: error, position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('Cancel clicked');} } ]});
    toast.present();
  }
}
