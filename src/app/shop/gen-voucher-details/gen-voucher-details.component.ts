import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Shop } from '../data/shop';
import { GeneralVouchersService } from '../services/general-voucher.service';
import { ShopService } from '../services/shop.service';
import { DateValidator } from '../utils/date-validate';
import { getDefaultDate } from '../utils/number-only.directive';

@Component({
  selector: 'app-gen-voucher-details',
  templateUrl: './gen-voucher-details.component.html',
  styleUrls: ['./gen-voucher-details.component.scss']
})
export class GenVoucherDetailsComponent implements OnInit {

  recordID: string;
  genVouchDtlsForm: FormGroup;
  pageMode = 'Create';
  filteredOptions: Observable<Shop[]>[]=[];

  public defaultAmount = '0.00';
  public defaultDate = getDefaultDate();
  private shopsList: Shop[] = [];

  constructor(public fb: FormBuilder, private genVouchSrvc: GeneralVouchersService, private shpSrvc: ShopService, private dialogRef: MatDialogRef<GenVoucherDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
        this.pageMode = this.pageMode.toLowerCase();
    }

    this.genVouchDtlsForm = this.fb.group({
      No: [this.genVouchSrvc.getMaxRcdNum(), [Validators.required, Validators.maxLength(50)]],
      date: [this.defaultDate, [Validators.required, Validators.maxLength(14), DateValidator()]],
      vouchList: this.fb.array([]),
      totDbAmt: [this.defaultAmount, Validators.maxLength(15)],
      totCrAmt: [this.defaultAmount, Validators.maxLength(15)]
    });

    this.shopsList = this.shpSrvc.getList();

    if (this.pageMode != 'create') {
      this.recordID = this.data.record.No;
      
      let listSize = this.data.record.vouchList.length;

      for(let i=0; i< listSize; i++)
      {
        this.addRecord();
      }

      setTimeout(()=>{
        this.genVouchDtlsForm.patchValue(this.data.record);
      })
    }
    else
    {
      this.addRecord();
    }
  }

  get No() {
    return this.genVouchDtlsForm.get('No') as FormControl;
  }
  get date() {
    return this.genVouchDtlsForm.get('date') as FormControl;
  }
  get vouchList(){
    return this.genVouchDtlsForm.get('vouchList') as FormArray;
  }
  get totDbAmt() {
    return this.genVouchDtlsForm.get('totDbAmt') as FormControl;
  }
  get totCrAmt() {
    return this.genVouchDtlsForm.get('totCrAmt') as FormControl;
  }

  getNewListFormGroup(): FormGroup
  {
    let arrayControl = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      desc: ['', [Validators.required, Validators.maxLength(50)]],
      dbAmt: [this.defaultAmount, Validators.maxLength(15)],
      crAmt: [this.defaultAmount, Validators.maxLength(15)]
    });

    return arrayControl;
  }

  addRecord()
  {
    this.vouchList.push(this.getNewListFormGroup());
    this.manageAutoComplete(this.vouchList.controls.length-1);
  }

  removeRecord(index: number)
  {
    this.vouchList.removeAt(index);
    this.updateTotalAmount();
  }

  updateTotalAmount()
  {
    let totalDbAmt = 0.00;
    let totalCrAmt = 0.00;

    this.vouchList.controls.forEach((group: FormGroup) => {

      totalDbAmt += this.getNumberValue( (group.get('dbAmt') as FormControl).value );
      totalCrAmt += this.getNumberValue( (group.get('crAmt') as FormControl).value );

    });

    this.totDbAmt.setValue(totalDbAmt.toFixed(2));
    this.totCrAmt.setValue(totalCrAmt.toFixed(2));

  }

  private getNumberValue(number): number {

    if (number && !isNaN(number)) {
      return +parseFloat(number).toFixed(2);
    } else {
      return 0.00;
    }

  }

  manageAutoComplete(index: number) {

    this.filteredOptions[index] = this.vouchList.at(index).get('code').valueChanges
            .pipe(
              startWith(''),
              map(value => value ? this._filter(value) : this.shopsList.slice())
            );

  }
  
  validateNSetCode(code: string, control: FormControl, firmNameFld: HTMLInputElement)
  {
    firmNameFld.value  = '';

    const shop = this.shopsList.find(x => x.code.toLowerCase() == code.toLowerCase());
    if (shop) {
      firmNameFld.value = shop.firmName;
    } else {
      control.setErrors({InvalidCode: true});
    }
  }

  private _filter(value: string): Shop[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(shop => shop.firmName.toLowerCase().includes(filterValue) || shop.code.toLowerCase().includes(filterValue));
  }

  save()
  {
    if (!this.genVouchDtlsForm.valid) {
      return false;
    }

    if(this.getNumberValue(this.totDbAmt.value) !== this.getNumberValue(this.totCrAmt.value) )
    {
        this.totDbAmt.setErrors({'UnequalAmt': true});
        this.totCrAmt.setErrors({'UnequalAmt': true});
        return false;
    }

    if (this.pageMode == 'create'){
      const saveStatus = this.genVouchSrvc.saveRecord(this.genVouchDtlsForm.value);

      if (!saveStatus) {
        this.No.setErrors({alreadyExists: true});
        return false;
      }
    } else {
      this.genVouchSrvc.updateRecord(this.recordID, this.genVouchDtlsForm.value);
    }

    this.dialogRef.close('saved');
  
  }

}
