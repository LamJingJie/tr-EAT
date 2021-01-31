import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminorderMonthlyPage } from './adminorder-monthly.page';

const routes: Routes = [
  {
    path: '',
    component: AdminorderMonthlyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminorderMonthlyPageRoutingModule {}
