import { Injectable } from '@angular/core';
import { Voucher } from '../data/voucher';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VouchersDetailsComponent } from '../vouchers-details/vouchers-details.component';
import { AuthService } from './auth.service';

@Injectable()
export class VouchersService {

  private vouchersList: Voucher[];
  // private vouchersListBehaviourSubject: BehaviorSubject<Voucher[]>;
  // public vouchersList$: Observable<Voucher[]>;

  constructor(private dialog: MatDialog, private authSrvc: AuthService) {/*
    if(localStorage.getItem('VouchersList'))
    {
      this.vouchersList = JSON.parse(localStorage.getItem('VouchersList'));
    }
    else
      this.vouchersList = [];

    this.vouchersListBehaviourSubject = new BehaviorSubject(this.vouchersList);
    this.vouchersList$ = this.vouchersListBehaviourSubject.asObservable();
    */
  }

  getList(): Voucher[] {
    return this.authSrvc.vouchersList; // this.vouchersListBehaviourSubject.value;
  }

  getVoucher(SL: string) {
    let recordData;
    if (SL) {
      recordData = this.getList().find( x => x.SL == SL);
    }
    return recordData;
  }

  saveVoucher(voucher: Voucher) {
    this.vouchersList = this.getList();
    if (this.vouchersList.findIndex( x => x.SL == voucher.SL) != -1 ) {
      return false;
    }

    this.vouchersList.push(voucher);

    this.updateStorage(this.vouchersList);

    return true;
  }

  updateVoucher(SL: string, voucher: Voucher) {
    this.vouchersList = this.getList();
    const index = this.vouchersList.findIndex( x => x.SL == SL);

    if (index >= 0) {
      this.vouchersList[index] = voucher;

      this.updateStorage(this.vouchersList);
    }

    return true;
  }

  deleteVoucher(SL: string) {
    if (SL) {
      this.vouchersList = this.getList();
      const index = this.vouchersList.findIndex( x => x.SL == SL);

      this.vouchersList.splice(index, 1);

      this.updateStorage(this.vouchersList);
    } else {
      throw Error(`Record with given SL ${SL} does not exist`);
    }
  }

  private updateStorage(vouchersList: Voucher[]) {
    this.authSrvc.vouchersList = vouchersList;
  }

  openVoucherDtlsPage(SL?: string): MatDialogRef<VouchersDetailsComponent> {
    const dialogRef = this.dialog.open(VouchersDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: SL ? 'Edit' : 'Create',
        record: this.getVoucher(SL)
      }
    });

    return dialogRef;
  }
}
