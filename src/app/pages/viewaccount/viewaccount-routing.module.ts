import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewaccountPage } from './viewaccount.page';

const routes: Routes = [
  {
    path: '',
    component: ViewaccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewaccountPageRoutingModule {}
