import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddvendorPageRoutingModule } from './modal-addvendor-routing.module';

import { ModalAddvendorPage } from './modal-addvendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalAddvendorPageRoutingModule
  ],
  declarations: [ModalAddvendorPage]
})
export class ModalAddvendorPageModule {}
