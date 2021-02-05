import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminVerifyPageRoutingModule } from './admin-verify-routing.module';

import { AdminVerifyPage } from './admin-verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminVerifyPageRoutingModule
  ],
  declarations: [AdminVerifyPage]
})
export class AdminVerifyPageModule {}
