import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAccountDetailsPageRoutingModule } from './admin-account-details-routing.module';

import { AdminAccountDetailsPage } from './admin-account-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAccountDetailsPageRoutingModule
  ],
  declarations: [AdminAccountDetailsPage]
})
export class AdminAccountDetailsPageModule {}
