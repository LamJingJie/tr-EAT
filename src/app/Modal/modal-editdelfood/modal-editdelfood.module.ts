import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditdelfoodPageRoutingModule } from './modal-editdelfood-routing.module';

import { ModalEditdelfoodPage } from './modal-editdelfood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalEditdelfoodPageRoutingModule
  ],
  declarations: [ModalEditdelfoodPage]
})
export class ModalEditdelfoodPageModule {}
