import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GeneralVoucher } from '../data/general-voucher';
import { GenVoucherDetailsComponent } from '../gen-voucher-details/gen-voucher-details.component';
import { AuthService } from './auth.service';

@Injectable()
export class GeneralVouchersService {

  private genVouchersList: GeneralVoucher[];

  constructor(private dialog: MatDialog, private authSrvc: AuthService) { }

  getList(): GeneralVoucher[] {
    return this.authSrvc.genVochuersList; // this.vouchersListBehaviourSubject.value;
  }

  getMaxRcdNum(){
    const items = this.getList().map(x => parseInt(x.No) );

    if (items.length > 0) {
      return Math.max(...items) + 1;
    } else {
      return 1;
    }    
  }

  getRecord(No: string) {
    let recordData;

    if (No) {
      recordData = this.getList().find( x => x.No == No);
    }
    return recordData;
  }

  saveRecord(voucher: GeneralVoucher) {
    this.genVouchersList = this.getList();

    if (this.genVouchersList.findIndex( x => x.No == voucher.No) != -1 ) {
      return false;
    }

    this.genVouchersList.push(voucher);

    this.updateStorage(this.genVouchersList);

    return true;
  }

  updateRecord(No: string, voucher: GeneralVoucher) {
    this.genVouchersList = this.getList();
    const index = this.genVouchersList.findIndex( x => x.No == No);

    if (index >= 0) {
      this.genVouchersList[index] = voucher;

      this.updateStorage(this.genVouchersList);
    }

    return true;
  }

  deleteRecord(No: string) {
    if (No) {
      this.genVouchersList = this.getList();
      const index = this.genVouchersList.findIndex( x => x.No == No);

      this.genVouchersList.splice(index, 1);

      this.updateStorage(this.genVouchersList);
    } else {
      throw Error(`Record with given No ${No} does not exist`);
    }
  }

  private updateStorage(genVouchersList: GeneralVoucher[]) {
    this.authSrvc.genVochuersList = genVouchersList;
  }

  openDialog(No?: string): MatDialogRef<GenVoucherDetailsComponent> {

    const dialogRef = this.dialog.open(GenVoucherDetailsComponent, {
      // width: '900px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: No ? 'Edit' : 'Create',
        record: this.getRecord(No)
      }
    });

    return dialogRef;
  }
}
