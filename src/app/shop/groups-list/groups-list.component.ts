import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from '../data/group';
import { GroupService } from '../services/group.service';


@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {

  public groupListDS: MatTableDataSource<Group>;
  public columnsToDisplay: string[] = ['code', 'name', 'grpType', 'oprts'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private grpSrvc: GroupService) {}

  ngOnInit() {
    this.groupListDS = new MatTableDataSource<Group>(this.grpSrvc.getList());
  }

  ngAfterViewInit() {
    this.groupListDS.paginator = this.paginator;
    this.groupListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.groupListDS.filter = value;
  }

  trackList(index, data) {
    return data.code;
  }

  refresh() {
    this.groupListDS.data = this.grpSrvc.getList();
  }

  edit(group: Group) {
    const dialogRef = this.grpSrvc.openGroupDtlsPage(group.code);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp == 'saved') {
        this.refresh();
      }
    });
  }

  delete(group: Group) {
    this.grpSrvc.deleteGroup(group.code);
    this.refresh();
  }
}
