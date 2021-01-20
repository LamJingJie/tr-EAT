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
                children: [
                  {
                    path: '',
                    loadChildren: () => import('../pages/foodlist/foodlist.module').then( m => m.FoodlistPageModule)
                  },
                  {
                    path: 'cart',
                    children: [
                      {
                        path: '',
                        loadChildren: () => import('../pages/cart/cart.module').then( m => m.CartPageModule)
                      }
                    ]
                   
                  }
                ]
               
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
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule)
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