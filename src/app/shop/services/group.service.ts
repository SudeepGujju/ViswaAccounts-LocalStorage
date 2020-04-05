import { Injectable } from '@angular/core';
import { Group } from '../data/group';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { Observable, of } from 'rxjs';

@Injectable()
export class GroupService {

  private groupsList: Group[];

  constructor(private dialog: MatDialog, private authSrvc: AuthService) {}

  getList(): Group[] {
    return this.authSrvc.groupsList;
  }

  getGroup(code: string) {
    let recordData;
    if (code) {
      recordData = this.getList().find( x => x.code == code);
    }
    return recordData;
  }

  saveGroup(group: Group) {
    this.groupsList = this.getList();
    if (this.groupsList.findIndex( x => x.code == group.code) != -1 ) {
      return false;
    }

    this.groupsList.push(group);

    this.updateStorage(this.groupsList);

    return true;
  }

  updateGroup(code: string, group: Group) {
    this.groupsList = this.getList();
    const index = this.groupsList.findIndex( x => x.code == code);

    if (index >= 0) {
      this.groupsList[index] = group;

      this.updateStorage(this.groupsList);
    }

    return true;
  }

  deleteGroup(code: string) {
    if (code) {
      this.groupsList = this.getList();
      const index = this.groupsList.findIndex( x => x.code == code);

      this.groupsList.splice(index, 1);

      this.updateStorage(this.groupsList);
    } else {
      throw Error(`Record with given code ${code} does not exist`);
    }
  }

  private updateStorage(groups: Group[]) {
    this.authSrvc.groupsList = groups;
  }

  openGroupDtlsPage(code?: string): MatDialogRef<GroupDetailsComponent> {
    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: code ? 'Edit' : 'Create',
        record: this.getGroup(code)
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
