import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddfoodPageRoutingModule } from './modal-addfood-routing.module';

import { ModalAddfoodPage } from './modal-addfood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalAddfoodPageRoutingModule
  ],
  declarations: [ModalAddfoodPage]
})
export class ModalAddfoodPageModule {}
