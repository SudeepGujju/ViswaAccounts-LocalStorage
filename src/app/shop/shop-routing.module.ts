import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { VouchersListComponent } from './vouchers-list/vouchers-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GenVoucherDetailsComponent } from './gen-voucher-details/gen-voucher-details.component';
import { GenVoucherListComponent } from './gen-voucher-list/gen-voucher-list.component';


const routes: Routes = [
  {
    path: 'register',
    canActivate: [AuthGuard],
    component: RegistrationComponent,
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
  },
  {
    path: '',
    component: ShopComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [{
      path: 'AccountsList',
      component: ShopListComponent
    },
    {
      path: 'VouchersList',
      component: VouchersListComponent
    },
    {
      path: 'InventoryList',
      component: InventoryListComponent
    },
    {
      path: 'GroupsList',
      component: GroupsListComponent
    },
    {
      path: 'GeneralVouchersList',
      component: GenVoucherListComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {

}
