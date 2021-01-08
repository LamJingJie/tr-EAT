import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewaccountPageRoutingModule } from './viewaccount-routing.module';

import { ViewaccountPage } from './viewaccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ViewaccountPageRoutingModule
  ],
  declarations: [ViewaccountPage]
})
export class ViewaccountPageModule {}
