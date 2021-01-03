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
    path: 'adminaddvendor',
    loadChildren: () => import('./pages/adminaddvendor/modal-addvendor.module').then( m => m.ModalAddvendorPageModule)
  },
  {
    path: 'modal-addfood/:account',
    loadChildren: () => import('./Modal/modal-addfood/modal-addfood.module').then( m => m.ModalAddfoodPageModule)
  },
  {
    path: 'modal-editdelfood',
    loadChildren: () => import('./Modal/modal-editdelfood/modal-editdelfood.module').then( m => m.ModalEditdelfoodPageModule)
  },
  {
    path: 'adminfood',
    loadChildren: () => import('./pages/adminfood/adminfood.module').then( m => m.AdminfoodPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
