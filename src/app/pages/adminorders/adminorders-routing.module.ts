import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminordersPage } from './adminorders.page';

const routes: Routes = [
  {
    path: '',
    component: AdminordersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminordersPageRoutingModule {}
