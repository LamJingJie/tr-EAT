import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddcanteenPage } from './modal-addcanteen.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddcanteenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddcanteenPageRoutingModule {}
