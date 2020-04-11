import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Voucher } from '../data/voucher';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VoucherService } from '../services/vouchers.service';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit {

  public voucherListDS: MatTableDataSource<Voucher>;
  private voucherList$: Subscription;
  public columnsToDisplay: string[] = ['SL', 'date', 'fromCode', 'toCode', 'billChNo', 'desc', 'receipt', 'payment', 'oprts'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private vochSrvc: VoucherService) { }

  ngOnInit() {
    this.voucherListDS = new MatTableDataSource<Voucher>(this.vochSrvc.getList());

    // this.voucherList$ = this.vochSrvc.vouchersList$.subscribe((resp)=>{
    //   this.voucherListDS.data = resp;
    // });
  }

  ngAfterViewInit() {
    this.voucherListDS.paginator = this.paginator;
    this.voucherListDS.sort = this.sort;
  }

  ngOnDestroy() {
    // this.voucherList$.unsubscribe();
  }

  applyFilter(value: string) {
    this.voucherListDS.filter = value;
  }

  trackList(index, data) {
    return data.SL;
  }

  refresh() {
    this.voucherListDS.data = this.vochSrvc.getList();
  }

  edit(voucher: Voucher) {
    const dialogRef = this.vochSrvc.openVoucherDtlsPage(voucher.SL);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp == 'saved') {
        this.refresh();
      }
    });
  }

  delete(voucher: Voucher) {
    this.vochSrvc.deleteVoucher(voucher.SL);
    this.refresh();
  }
}
