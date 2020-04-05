import { Component, OnInit, Inject, HostBinding, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, delay, catchError, tap, startWith } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { Group } from '../data/group';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss'],
})
export class ShopDetailsComponent implements OnInit {

  shopDtlsForm: FormGroup;
  recordID: string;
  pageMode = 'Create';
  defaultAmount = '0.00';
  filteredGroupOptions: Observable<Group[]>;

  private groupsList: Group[] = [];

  @ViewChild('groupCodeFirmName', {static: false}) groupCodeFirmEle: ElementRef;

  constructor(public fb: FormBuilder, private shpSrvc: ShopService, private authSrvc: AuthService, private grpSrvc: GroupService, private dialogRef: MatDialogRef<ShopDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
        this.pageMode = this.pageMode.toLowerCase();
    }

    this.shopDtlsForm = this.fb.group({
      code: ['',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(10)],
        asyncValidators: (this.pageMode == 'create' ? [this.isCodeUnique()] : [] )
      }],
      firmName: ['', [Validators.required, Validators.maxLength(50)] ],
      proprietor: ['', [Validators.maxLength(50)] ],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10)] ],
      dno: ['', Validators.maxLength(15)],
      strtNo: ['', Validators.maxLength(50)],
      area: ['', Validators.maxLength(50)],
      town: ['', Validators.maxLength(50)],
      dl1: ['', Validators.maxLength(50) ],
      dl2: ['', Validators.maxLength(50)],
      gst: ['', [Validators.minLength(2), Validators.maxLength(15)] ],
      mailid: ['', [Validators.email, Validators.maxLength(50)] ],
      opngBalAmt: [this.defaultAmount, Validators.maxLength(15)],
      groupCode: ['', [Validators.required, Validators.maxLength(50)]]
    });

    if (this.pageMode != 'create') {
      this.recordID = this.data.record.code;
      this.shopDtlsForm.patchValue(this.data.record);
      setTimeout(() => {
        this.validateNSetgroupCode(this.data.record.groupCode);
      });
    }

    this.groupsList = this.grpSrvc.getList();

    this.filteredGroupOptions = this.groupCode.valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value) : this.groupsList.slice())
        );
  }

  onSelectgroupCode({option}) {
    this.validateNSetgroupCode(option.value);
  }

  validateNSetgroupCode(code: string) {

    this.groupCodeFirmEle.nativeElement.value = '';

    const group = this.groupsList.find(group => group.code.toLowerCase() == code.toLowerCase());
    if (group) {
      this.groupCodeFirmEle.nativeElement.value = group.name;
    } else {
      this.groupCode.setErrors({InvalidCode: true});
    }

  }

  private _filter(value: string): Group[] {
    const filterValue = value.toLowerCase();

    return this.groupsList.filter(group => group.name.toLowerCase().includes(filterValue) || group.code.toLowerCase().includes(filterValue));
  }

  get code() {
    return this.shopDtlsForm.get('code') as FormControl;
  }

  get firmName() {
    return this.shopDtlsForm.get('firmName') as FormControl;
  }

  get proprietor() {
    return this.shopDtlsForm.get('proprietor') as FormControl;
  }

  get phone() {
    return this.shopDtlsForm.get('phone') as FormControl;
  }

  get dno() {
    return this.shopDtlsForm.get('dno') as FormControl;
  }

  get strtNo() {
    return this.shopDtlsForm.get('strtNo') as FormControl;
  }

  get area() {
    return this.shopDtlsForm.get('area') as FormControl;
  }

  get town() {
    return this.shopDtlsForm.get('town') as FormControl;
  }

  get dl1() {
    return this.shopDtlsForm.get('dl1') as FormControl;
  }

  get dl2() {
    return this.shopDtlsForm.get('dl2') as FormControl;
  }

  get gst() {
    return this.shopDtlsForm.get('gst') as FormControl;
  }

  get mailid() {
    return this.shopDtlsForm.get('mailid') as FormControl;
  }

  get opngBalAmt() {
    return this.shopDtlsForm.get('opngBalAmt') as FormControl;
  }

  get groupCode() {
    return this.shopDtlsForm.get('groupCode') as FormControl;
  }

  save() {

    if (!this.shopDtlsForm.valid) {
      return false;
    }

    if (this.pageMode == 'create') {
      const saveStatus = this.shpSrvc.saveShop(this.shopDtlsForm.value);

      if (!saveStatus) {
        return false;
      }
    } else {
      this.shpSrvc.updateShop(this.recordID, this.shopDtlsForm.value);
    }

    this.dialogRef.close('saved');
  }

  isCodeUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.shpSrvc.isCodeUnique(control.value).pipe(
        delay(1000),
        map(isExist => isExist ? {alreadyExists: true} : null ),
        catchError(() => of(null))
      );
    };
  }

}
