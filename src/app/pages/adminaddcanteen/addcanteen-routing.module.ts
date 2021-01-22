import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddcanteenPage } from './addcanteen.page';

const routes: Routes = [
  {
    path: '',
    component: AddcanteenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddcanteenPageRoutingModule {}

