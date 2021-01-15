import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminordersPageRoutingModule } from './adminorders-routing.module';

import { AdminordersPage } from './adminorders.page';
import { AdminordersPipe } from './adminorders.pipe';
import { AdminOrderStallNamePipe } from './admin-order-stall-name.pipe';
import { AdminOrderCanteenPipe } from './admin-order-canteen.pipe';
import { CalendarModule } from 'ion2-calendar';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminordersPageRoutingModule,
    CalendarModule
  ],
  declarations: [AdminordersPage, AdminordersPipe, AdminOrderStallNamePipe, AdminOrderCanteenPipe]
})
export class AdminordersPageModule {}
