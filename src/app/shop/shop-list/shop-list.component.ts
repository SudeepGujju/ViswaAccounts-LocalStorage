import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Shop } from '../data/shop';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  public shopsListDS: MatTableDataSource<Shop>;
  private shopsList$: Subscription;
  public columnsToDisplay: string[] = ['code', 'firmName', 'town', 'proprietor', 'phone', 'gst', 'opngBalAmt', 'groupCode', 'oprts']; // ,'dno', 'strtNo', 'area', 'town', 'gst', 'dl1', 'dl2', 'phone', 'mailid'

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private shpSrvc: ShopService) { }

  ngOnInit() {
    this.shopsListDS = new MatTableDataSource<Shop>(this.shpSrvc.getList());
 /*
    this.shopsList$ = this.shpSrvc.shopsList$.subscribe((resp)=>{
      this.shopsListDS.data = resp;
    });
*/
  }

  ngAfterViewInit() {
    this.shopsListDS.paginator = this.paginator;
    this.shopsListDS.sort = this.sort;
  }

  ngOnDestroy() {
    // this.shopsList$.unsubscribe();
  }

  applyFilter(value: string) {
    this.shopsListDS.filter = value;
  }

  trackList(index, data) {
    return data.code;
  }

  refresh() {
    this.shopsListDS.data = this.shpSrvc.getList();
  }

  edit(shop: Shop) {
    const dialogRef = this.shpSrvc.openShopDtlsPage(shop.code);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp == 'saved') {
        this.refresh();
      }
    });
  }

  delete(shop: Shop) {
    this.shpSrvc.deleteShop(shop.code);
    this.refresh();
  }
}
