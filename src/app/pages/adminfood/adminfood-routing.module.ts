import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminfoodPage } from './adminfood.page';

const routes: Routes = [
  {
    path: '',
    component: AdminfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminfoodPageRoutingModule {}
