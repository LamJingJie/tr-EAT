import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminVerifyPage } from './admin-verify.page';

const routes: Routes = [
  {
    path: '',
    component: AdminVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminVerifyPageRoutingModule {}
