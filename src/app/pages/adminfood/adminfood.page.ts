import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular'; 
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { ModalAddfoodPage } from 'src/app/Modal/modal-addfood/modal-addfood.page';
import { Router, NavigationExtras } from '@angular/router';

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
    private modalCtrl: ModalController, private router: Router) {
    console.log(this.currentAcc);
    this.vendorSubscription = this.userService.getOnlyVendor().subscribe((res)=>{
     // console.log(res);
      this.vendoracc = res;
    })
   }

   SelectVendorAcc(acc){
    //console.log(acc.detail.value);
    this.currentAcc = acc.detail.value;
    console.log(this.currentAcc)
    this.getFoodRespectively(this.currentAcc);
  }

  getFoodRespectively(acc){
    //console.log("Worked: " + acc);
    this.foodSubscription = this.foodService.getRespectiveFood(acc).subscribe((res)=>{
      console.log(res);
      this.foodData = res;
    })
  }


  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.vendorSubscription){
      this.vendorSubscription.unsubscribe();
    }
    if(this.foodSubscription){
      this.foodSubscription.unsubscribe();
    }
  }
}
