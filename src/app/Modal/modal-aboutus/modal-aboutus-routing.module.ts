import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAboutusPage } from './modal-aboutus.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAboutusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAboutusPageRoutingModule {}
