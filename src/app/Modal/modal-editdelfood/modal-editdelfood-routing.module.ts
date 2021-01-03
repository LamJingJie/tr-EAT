import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditdelfoodPage } from './modal-editdelfood.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditdelfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditdelfoodPageRoutingModule {}
