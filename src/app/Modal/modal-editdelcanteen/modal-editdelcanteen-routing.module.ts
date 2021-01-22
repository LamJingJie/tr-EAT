import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditdelcanteenPage } from './modal-editdelcanteen.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditdelcanteenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditdelcanteenPageRoutingModule {}
