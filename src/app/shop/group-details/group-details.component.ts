import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { GroupService } from '../services/group.service';
import { AuthService } from '../services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map, catchError, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy{

  groupDtlsForm: FormGroup;
  recordID: string;
  pageMode = 'Create';
  isSmallScrn: boolean = false;
  private isSmallScrnSubscription: Subscription;

  constructor(public fb: FormBuilder, private grpSrvc: GroupService, private authSrvc: AuthService, private dialogRef: MatDialogRef<GroupDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

    this.isSmallScrnSubscription = this.authSrvc.isHandSet$.subscribe(
      (ismall)=>{this.isSmallScrn = ismall},
      (error)=>{}
    );

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
        this.pageMode = this.pageMode.toLowerCase();
    }

    this.groupDtlsForm = this.fb.group({
      code: ['',
      {
        validators: [Validators.required, Validators.maxLength(10)],
        asyncValidators: (this.pageMode === 'create' ? [this.isCodeUnique()] : [] )
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      grpType: ['trading', [Validators.required]]
    });

    if (this.pageMode !== 'create') {
      this.recordID = this.data.record.code;
      this.groupDtlsForm.patchValue(this.data.record);
    }
  }

  ngOnDestroy(){
    this.isSmallScrnSubscription.unsubscribe();
  }

  get name() {
    return this.groupDtlsForm.get('name') as FormControl;
  }

  get code() {
    return this.groupDtlsForm.get('code') as FormControl;
  }

  get grpType() {
    return this.groupDtlsForm.get('grpType') as FormControl;
  }

  save() {

    if (!this.groupDtlsForm.valid) {
      return false;
    }

    if (this.pageMode === 'create') {
      const saveStatus = this.grpSrvc.saveGroup(this.groupDtlsForm.value);

      if (!saveStatus) {
        return false;
      }
    } else {
      this.grpSrvc.updateGroup(this.recordID, this.groupDtlsForm.value);
    }

    this.dialogRef.close('saved');
  }

  isCodeUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.grpSrvc.isCodeUnique(control.value).pipe(
        distinctUntilChanged(),
        delay(1000),
        map(isExist => isExist ? {alreadyExists: true} : null ),
        catchError(() => of(null))
      );
    };
  }

}
