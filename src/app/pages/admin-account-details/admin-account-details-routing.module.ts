import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAccountDetailsPage } from './admin-account-details.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAccountDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAccountDetailsPageRoutingModule {}
