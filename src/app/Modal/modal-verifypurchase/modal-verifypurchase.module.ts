import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalVerifypurchasePageRoutingModule } from './modal-verifypurchase-routing.module';

import { ModalVerifypurchasePage } from './modal-verifypurchase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalVerifypurchasePageRoutingModule
  ],
  declarations: [ModalVerifypurchasePage]
})
export class ModalVerifypurchasePageModule {}
