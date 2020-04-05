import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { ShopService } from './services/shop.service';
import { VouchersService } from './services/vouchers.service';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { DateDirective, NumberDirective, UpperCaseDirective } from './utils/number-only.directive';
import { VouchersDetailsComponent } from './vouchers-details/vouchers-details.component';
import { VouchersListComponent } from './vouchers-list/vouchers-list.component';
import { AuthGuard } from './auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { InventoryService } from './services/inventory.service';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { GroupService } from './services/group.service';
import { GroupsListComponent } from './groups-list/groups-list.component';


@NgModule({
  declarations: [
    ShopComponent,
    ShopDetailsComponent,
    ShopListComponent,
    NumberDirective,
    DateDirective,
    VouchersListComponent,
    VouchersDetailsComponent,
    LoginComponent,
    RegistrationComponent,
    InventoryDetailsComponent,
    GroupDetailsComponent,
    InventoryListComponent,
    GroupsListComponent,
    UpperCaseDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    ShopRoutingModule
  ],
  providers: [
    ShopService,
    VouchersService,
    AuthService,
    InventoryService,
    GroupService,
    AuthGuard
  ],
  entryComponents: [ShopDetailsComponent, VouchersDetailsComponent, InventoryDetailsComponent, GroupDetailsComponent]
})
export class ShopModule { }
