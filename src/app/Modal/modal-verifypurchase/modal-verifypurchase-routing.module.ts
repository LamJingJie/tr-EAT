import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalVerifypurchasePage } from './modal-verifypurchase.page';

const routes: Routes = [
  {
    path: '',
    component: ModalVerifypurchasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalVerifypurchasePageRoutingModule {}
