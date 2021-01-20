import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodlistPageRoutingModule } from './foodlist-routing.module';

import { FoodlistPage } from './foodlist.page';
import { CartitemcountPipe } from './cartitemcount.pipe';
import { CountItemsCartPipe } from './count-items-cart.pipe';
import { CartTotalCostPipe } from './cart-total-cost.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodlistPageRoutingModule
  ],
  declarations: [FoodlistPage, CartitemcountPipe, CountItemsCartPipe, CartTotalCostPipe]
})
export class FoodlistPageModule {}
