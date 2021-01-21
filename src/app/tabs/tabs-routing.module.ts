import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          },
          {
            path: 'vendors',
            children: [
              {
                path: '',
                loadChildren: () => import('../pages/vendors/vendors.module').then( m => m.VendorsPageModule)
              },
              {
                path: 'foodlist',
                loadChildren: () => import('../pages/foodlist/foodlist.module').then( m => m.FoodlistPageModule)
              }
            ]
            
          },
        ]
       
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)

      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },

      //Admin
      {
        path: 'tab5',
        children:[
          {
            path: '',
            loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule)
          },
          {
            path: 'adminorders',
            loadChildren: () => import('../pages/adminorders/adminorders.module').then( m => m.AdminordersPageModule)
          },
          {
            path: 'viewaccount',
            children:[
              {
                path:'',
                loadChildren: () => import('../pages/viewaccount/viewaccount.module').then( m => m.ViewaccountPageModule)
              },
              {
                path: 'admin-account-details/:account',
                loadChildren: () => import('../pages/admin-account-details/admin-account-details.module').then( m => m.AdminAccountDetailsPageModule)
              },
              {
                path: 'adminfood/:account',
                loadChildren: () => import('../pages/adminfood/adminfood.module').then( m => m.AdminfoodPageModule)
              },
              
            ]
          
          },
        ]
        
      },
      
    
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}