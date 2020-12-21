import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular'; 
import {CanteenService} from '../services/canteen/canteen.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  canteen: any = [];
  data: boolean;
  constructor(private canteenService: CanteenService, private alertController: AlertController) {
    this.data = true;

    canteenService.getAll().subscribe((data) => {this.canteen = data;});
  }

}
