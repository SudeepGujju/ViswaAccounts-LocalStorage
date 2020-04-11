import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ShopService } from './services/shop.service';
import { VoucherService as VoucherService } from './services/vouchers.service';
import { InventoryService } from './services/inventory.service';
import { GroupService } from './services/group.service';
import { GeneralVouchersService } from './services/general-voucher.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(private authSrvc: AuthService, private shpSrvc: ShopService, private vouchSrvc: VoucherService, private invtrySrvc: InventoryService, private grpSrvc: GroupService, private genVochSrvc :GeneralVouchersService, private router: Router) { }

  ngOnInit() {
  }

  openDialog(pageName: string) {
    if (pageName == 'createAccnt') {
      this.shpSrvc.openShopDtlsPage();
    }
    else if (pageName == 'createVchr') {
      this.vouchSrvc.openVoucherDtlsPage();
    }
    else if (pageName == 'createInvntry') {
      this.invtrySrvc.openInventoryDtlsPage();
    }
    else if (pageName == 'createGroup') {
      this.grpSrvc.openGroupDtlsPage();
    }
    else if (pageName == 'createGenVchr') {
      this.genVochSrvc.openDialog();
    }
  }

  get user() {
    return this.authSrvc.user;
  }

  logout() {
    this.authSrvc.logout();
    this.router.navigate(['/shop']);
    location.reload(true);
  }

}
