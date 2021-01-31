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


  //Below are all modals
  {
    path: 'adminaddvendor',
    loadChildren: () => import('./pages/adminaddvendor/modal-addvendor.module').then( m => m.ModalAddvendorPageModule)
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
    path: 'calendar-modal',
    loadChildren: () => import('./Modal/calendar-modal/calendar-modal.module').then( m => m.CalendarModalPageModule)
  },
  {
    path: 'modal-verifychckout',
    loadChildren: () => import('./Modal/modal-verifychckout/modal-verifychckout.module').then( m => m.ModalVerifychckoutPageModule)
  },
  {
    path: 'modal-addcanteen',
    loadChildren: () => import('./Modal/modal-addcanteen/modal-addcanteen.module').then( m => m.ModalAddcanteenPageModule)
  },
  {
    path: 'modal-editdelcanteen/:id',
    loadChildren: () => import('./Modal/modal-editdelcanteen/modal-editdelcanteen.module').then( m => m.ModalEditdelcanteenPageModule)
  },
  {
    path: 'modal-aboutus',
    loadChildren: () => import('./Modal/modal-aboutus/modal-aboutus.module').then( m => m.ModalAboutusPageModule)
  },
 







];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
