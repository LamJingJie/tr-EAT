import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalVerifychckoutPage } from './modal-verifychckout.page';

const routes: Routes = [
  {
    path: '',
    component: ModalVerifychckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalVerifychckoutPageRoutingModule {}
