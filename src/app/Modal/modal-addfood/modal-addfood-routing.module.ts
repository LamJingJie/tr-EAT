import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddfoodPage } from './modal-addfood.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddfoodPageRoutingModule {}
