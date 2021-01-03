import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminfoodPageRoutingModule } from './adminfood-routing.module';

import { AdminfoodPage } from './adminfood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AdminfoodPageRoutingModule
  ],
  declarations: [AdminfoodPage]
})
export class AdminfoodPageModule {}
