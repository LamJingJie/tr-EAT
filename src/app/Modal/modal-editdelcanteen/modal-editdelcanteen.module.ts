import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditdelcanteenPageRoutingModule } from './modal-editdelcanteen-routing.module';

import { ModalEditdelcanteenPage } from './modal-editdelcanteen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditdelcanteenPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ModalEditdelcanteenPage]
})
export class ModalEditdelcanteenPageModule {}
