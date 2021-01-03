import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddvendorPage } from './modal-addvendor.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddvendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddvendorPageRoutingModule {}
