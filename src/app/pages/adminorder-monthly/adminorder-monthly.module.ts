import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminorderMonthlyPageRoutingModule } from './adminorder-monthly-routing.module';

import { AdminorderMonthlyPage } from './adminorder-monthly.page';
import { OrdermonthlyNamePipe } from './ordermonthly-name.pipe';
import { OrdermonthlyCanteenPipe } from './ordermonthly-canteen.pipe';
import { OrdermonthlyStallPipe } from './ordermonthly-stall.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminorderMonthlyPageRoutingModule
  ],
  declarations: [AdminorderMonthlyPage, OrdermonthlyNamePipe, OrdermonthlyCanteenPipe, OrdermonthlyStallPipe]
})
export class AdminorderMonthlyPageModule {}
