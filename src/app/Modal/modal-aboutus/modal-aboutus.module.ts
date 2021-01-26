import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAboutusPageRoutingModule } from './modal-aboutus-routing.module';

import { ModalAboutusPage } from './modal-aboutus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAboutusPageRoutingModule
  ],
  declarations: [ModalAboutusPage]
})
export class ModalAboutusPageModule {}
