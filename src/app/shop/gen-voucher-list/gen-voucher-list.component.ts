import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralVoucher } from '../data/general-voucher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GeneralVouchersService } from '../services/general-voucher.service';

@Component({
  selector: 'app-gen-voucher-list',
  templateUrl: './gen-voucher-list.component.html',
  styleUrls: ['./gen-voucher-list.component.scss']
})
export class GenVoucherListComponent implements OnInit {

  public genVoucherListDS: MatTableDataSource<GeneralVoucher>;
  public columnsToDisplay: string[] = ['No', 'date', 'totDbAmt', 'totCrAmt', 'oprts'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private genVouchSrvc: GeneralVouchersService) { }

  ngOnInit() {
    this.genVoucherListDS = new MatTableDataSource<GeneralVoucher>(this.genVouchSrvc.getList());
  }
  
  ngAfterViewInit() {
    this.genVoucherListDS.paginator = this.paginator;
    this.genVoucherListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.genVoucherListDS.filter = value;
  }

  trackList(index, data) {
    return data.No;
  }

  refresh() {
    this.genVoucherListDS.data = this.genVouchSrvc.getList();
  }

  edit(voucher: GeneralVoucher) {

    const dialogRef = this.genVouchSrvc.openDialog(voucher.No);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp == 'saved') {
        this.refresh();
      }
    });
  }

  delete(voucher: GeneralVoucher) {

    this.genVouchSrvc.deleteRecord(voucher.No);
    this.refresh();
  }
}
