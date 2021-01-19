import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodlistPageRoutingModule } from './foodlist-routing.module';

import { FoodlistPage } from './foodlist.page';
import { CartitemcountPipe } from './cartitemcount.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodlistPageRoutingModule
  ],
  declarations: [FoodlistPage, CartitemcountPipe]
})
export class FoodlistPageModule {}
