import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import {CanteenService} from '../services/canteen/canteen.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  canteen: any = [];
  data: boolean;
  constructor(private canteenService: CanteenService, private alertController: AlertController, private router: Router) {
    this.data = true;

    canteenService.getAll().subscribe((data) => {this.canteen = data;});
  }

  goSignUp(){
    this.router.navigate(['signup']);
  }

}
