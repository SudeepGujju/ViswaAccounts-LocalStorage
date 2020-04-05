import { Injectable } from '@angular/core';
import { InventoryDetailsComponent } from '../inventory-details/inventory-details.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { Inventory } from '../data/inventory';

@Injectable()
export class InventoryService {

  private inventoriesList: Inventory[];

  constructor(private dialog: MatDialog, private authSrvc: AuthService) {}

  getList(): Inventory[] {
    return this.authSrvc.inventoriesList;
    // this.inventorysListBehaviourSubject.value;
  }

  getMaxRcdNum(invntryType: string): number {

    const items = this.getList().filter(x => x.invntryType == invntryType).map(x => parseInt(x.SL) );

    if (items.length > 0) {
      return Math.max(...items) + 1;
    } else {
      return 1;
    }
  }

  getInventory(id: string) {
    let recordData;
    if (id) {
      recordData = this.getList().find( x => x.id == id);
    }
    return recordData;
  }

  saveInventory(inventory: Inventory) {
    this.inventoriesList = this.getList();
    const index = this.inventoriesList.findIndex( x => x.id == inventory.id);

    if (index != -1 ) {
      return false;
    }

    this.inventoriesList.push(inventory);

    this.updateStorage(this.inventoriesList);

    return true;
  }

  updateInventory(id: string, inventory: Inventory) {
    this.inventoriesList = this.getList();
    const index = this.inventoriesList.findIndex( x => x.id == id);

    if (index >= 0) {
      this.inventoriesList[index] = inventory;

      this.updateStorage(this.inventoriesList);
    }

    return true;
  }

  deleteInventory(id: string) {
    if (id) {
      this.inventoriesList = this.getList();
      const index = this.inventoriesList.findIndex( x => x.id == id);

      this.inventoriesList.splice(index, 1);

      this.updateStorage(this.inventoriesList);
    } else {
      throw Error(`Record with given id ${id} does not exist`);
    }
  }

  private updateStorage(inventoriesList: Inventory[]) {
    this.authSrvc.inventoriesList = inventoriesList;
  }

  openInventoryDtlsPage(id?: string): MatDialogRef<InventoryDetailsComponent> {
    const dialogRef = this.dialog.open(InventoryDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: id ? 'Edit' : 'Create',
        record: this.getInventory(id)
      }
    });

    return dialogRef;
  }
}
