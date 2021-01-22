import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalVerifychckoutPageRoutingModule } from './modal-verifychckout-routing.module';

import { ModalVerifychckoutPage } from './modal-verifychckout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalVerifychckoutPageRoutingModule
  ],
  declarations: [ModalVerifychckoutPage]
})
export class ModalVerifychckoutPageModule {}
