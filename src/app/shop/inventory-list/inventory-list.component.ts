import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Inventory } from '../data/inventory';
import { InventoryService } from '../services/inventory.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  public inventoryListDS: MatTableDataSource<Inventory>;
  public columnsToDisplay: string[] = ['invntryType', 'SL', 'date', 'fromCode', 'toCode', 'cashRcredit', 'invcNo', 'invcDate', 'totalAmt', 'totalPerAmt', 'roundingAmt', 'totalInvcAmt', 'oprts'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private invtrySrvc: InventoryService) { }

  ngOnInit() {
    this.inventoryListDS = new MatTableDataSource<Inventory>(this.invtrySrvc.getList());
  }

  ngAfterViewInit() {
    this.inventoryListDS.paginator = this.paginator;
    this.inventoryListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.inventoryListDS.filter = value;
  }

  trackList(index, data) {
    return data.id;
  }

  refresh() {
    this.inventoryListDS.data = this.invtrySrvc.getList();
  }

  edit(inventory: Inventory) {
    const dialogRef = this.invtrySrvc.openInventoryDtlsPage(inventory.id);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp == 'saved') {
        this.refresh();
      }
    });
  }

  delete(inventory: Inventory) {
    this.invtrySrvc.deleteInventory(inventory.id);
    this.refresh();
  }

}
