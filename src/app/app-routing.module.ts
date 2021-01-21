import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'adminaddcanteen',
    loadChildren: () => import('./pages/adminaddcanteen/addcanteen.module').then( m => m.AdminaddcanteenPageModule)
  },

  //Below are all modals
  {
    path: 'adminaddvendor',
    loadChildren: () => import('./pages/adminaddvendor/modal-addvendor.module').then( m => m.ModalAddvendorPageModule)
  },
  {
    path: 'canteen',
    loadChildren: () => import('./pages/adminaddcanteen/addcanteen.module').then( m => m.AdminaddcanteenPageModule)
  },
  {
    path: 'modal-addfood/:account',
    loadChildren: () => import('./Modal/modal-addfood/modal-addfood.module').then( m => m.ModalAddfoodPageModule)
  },
  {
    path: 'modal-editdelfood/:id',
    loadChildren: () => import('./Modal/modal-editdelfood/modal-editdelfood.module').then( m => m.ModalEditdelfoodPageModule)
  },
  {
    path: 'adminfood/:account',
    loadChildren: () => import('./pages/adminfood/adminfood.module').then( m => m.AdminfoodPageModule)
  },
  {
    path: 'viewaccount',
    loadChildren: () => import('./pages/viewaccount/viewaccount.module').then( m => m.ViewaccountPageModule)
  },
  {
    path: 'admin-account-details/:account',
    loadChildren: () => import('./pages/admin-account-details/admin-account-details.module').then( m => m.AdminAccountDetailsPageModule)
  },
  {
    path: 'adminorders',
    loadChildren: () => import('./pages/adminorders/adminorders.module').then( m => m.AdminordersPageModule)
  },
  {
    path: 'calendar-modal',
    loadChildren: () => import('./Modal/calendar-modal/calendar-modal.module').then( m => m.CalendarModalPageModule)
  },
  {
    path: 'vendors',
    loadChildren: () => import('./pages/vendors/vendors.module').then( m => m.VendorsPageModule)
  },
  {
    path: 'foodlist',
    loadChildren: () => import('./pages/foodlist/foodlist.module').then( m => m.FoodlistPageModule)
  },
  {
    path: 'modal-addcanteen',
    loadChildren: () => import('./Modal/modal-addcanteen/modal-addcanteen.module').then( m => m.ModalAddcanteenPageModule)
  },
  {
    path: 'modal-editdelcanteen/:id',
    loadChildren: () => import('./Modal/modal-editdelcanteen/modal-editdelcanteen.module').then( m => m.ModalEditdelcanteenPageModule)
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
