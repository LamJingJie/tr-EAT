import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddcanteenPageRoutingModule } from './addcanteen-routing.module';
import {AddcanteenPage} from './addcanteen.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddcanteenPageRoutingModule
  ],
  declarations: [AddcanteenPage]
})
export class AdminaddcanteenPageModule {}


