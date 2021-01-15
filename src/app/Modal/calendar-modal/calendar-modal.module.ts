import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarModalPageRoutingModule } from './calendar-modal-routing.module';

import { CalendarModalPage } from './calendar-modal.page';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModalPageRoutingModule,
    CalendarModule
  ],
  declarations: [CalendarModalPage]
})
export class CalendarModalPageModule {}
