import { Injectable } from '@angular/core';
import { Shop } from '../data/shop';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShopDetailsComponent } from '../shop-details/shop-details.component';
import { AuthService } from './auth.service';

@Injectable()
export class ShopService {

  private shopsList: Shop[];
  // private shopsListBehaviourSubject: BehaviorSubject<Shop[]>;
  // public shopsList$: Observable<Shop[]>;

  constructor(private dialog: MatDialog, private authSrvc: AuthService) {
    /*
    if(localStorage.getItem('ShopsList'))
    {
      this.shopsList = JSON.parse(localStorage.getItem('ShopsList'));
    }
    else
      this.shopsList = [];

    this.shopsListBehaviourSubject = new BehaviorSubject(this.shopsList);
    this.shopsList$ = this.shopsListBehaviourSubject.asObservable();
    */
  }

  getList(): Shop[] {
    return this.authSrvc.shopsList; // this.shopsListBehaviourSubject.value;
  }

  getShop(code: string) {
    let recordData;
    if (code) {
      recordData = this.getList().find( x => x.code == code);
    }
    return recordData;
  }

  saveShop(shop: Shop) {
    this.shopsList = this.getList();
    if (this.shopsList.findIndex( x => x.code == shop.code) != -1 ) {
      return false;
    }

    this.shopsList.push(shop);

    this.updateStorage(this.shopsList);

    return true;
  }

  updateShop(code: string, shop: Shop) {
    this.shopsList = this.getList();
    const index = this.shopsList.findIndex( x => x.code == code);

    if (index >= 0) {
      this.shopsList[index] = shop;

      this.updateStorage(this.shopsList);
    }

    return true;
  }

  deleteShop(code: string) {
    if (code) {
      this.shopsList = this.getList();
      const index = this.shopsList.findIndex( x => x.code == code);

      this.shopsList.splice(index, 1);

      this.updateStorage(this.shopsList);
    } else {
      throw Error(`Record with given code ${code} does not exist`);
    }
  }

  private updateStorage(shopsList: Shop[]) {
    this.authSrvc.shopsList = shopsList;
  }

  openShopDtlsPage(code?: string): MatDialogRef<ShopDetailsComponent> {
    const dialogRef = this.dialog.open(ShopDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: code ? 'Edit' : 'Create',
        record: this.getShop(code)
      }
    });
    return dialogRef;
  }

  isCodeUnique(code: string): Observable<boolean> {
    if (this.getList().findIndex( x => x.code == code) != -1 ) {
      return of(true);
    } else {
      return of(false);
    }
  }

}
