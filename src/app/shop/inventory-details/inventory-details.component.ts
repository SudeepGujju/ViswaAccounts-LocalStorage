import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Shop } from '../data/shop';
import { AuthService } from '../services/auth.service';
import { InventoryService } from '../services/inventory.service';
import { ShopService } from '../services/shop.service';
import { DateValidator } from '../utils/date-validate';
import { getDefaultDate } from '../utils/number-only.directive';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnDestroy {

  inventoryDtlsForm: FormGroup;
  recordID: string;
  pageMode = 'Create';
  filteredFromOptions: Observable<Shop[]>;
  filteredToOptions: Observable<Shop[]>;
  isSmallScrn: boolean = false;

  private isSmallScrnSubscription: Subscription;
  public defaultAmount = '0.00';
  public defaultDate = getDefaultDate();
  private shopsList: Shop[] = [];

  @ViewChild('fromCodeFirmName', {static: false}) fromCodeFirmEle: ElementRef;
  @ViewChild('toCodeFirmName', {static: false}) toCodeFirmEle: ElementRef;

  constructor(public fb: FormBuilder, private invtrySrvc: InventoryService, private shpSrvc: ShopService, private authSrvc: AuthService, private dialogRef: MatDialogRef<InventoryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

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

    this.inventoryDtlsForm = this.fb.group({
      id: [this.invtrySrvc.getList().length + 1, [Validators.required]],
      invntryType: ['sale', [Validators.required]],
      SL: ['', [Validators.required, Validators.maxLength(50)]],
      date: [this.defaultDate, [Validators.required, Validators.maxLength(14), DateValidator()]],
      fromCode: ['', {validators: [Validators.required, Validators.maxLength(10)]}],
      toCode: ['', [Validators.required, Validators.maxLength(10)]],
      cashRcredit: ['cash', Validators.required],
      invcNo: ['', [Validators.required, Validators.maxLength(50)]],
      invcDate: [this.defaultDate, [Validators.required, Validators.maxLength(14), DateValidator()]],
      fiveAmt: [this.defaultAmount, Validators.maxLength(15)],
      fivePerAmt: [this.defaultAmount, Validators.maxLength(15)],
      twelveAmt: [this.defaultAmount, Validators.maxLength(15)],
      twelvePerAmt: [this.defaultAmount, Validators.maxLength(15)],
      eighteenAmt: [this.defaultAmount, Validators.maxLength(15)],
      eighteenPerAmt: [this.defaultAmount, Validators.maxLength(15)],
      twntyEightAmt: [this.defaultAmount, Validators.maxLength(15)],
      twntyEightPerAmt: [this.defaultAmount, Validators.maxLength(15)],
      zeroAmt: [this.defaultAmount, Validators.maxLength(15)],
      totalAmt: [this.defaultAmount, Validators.maxLength(15)],
      totalPerAmt: [this.defaultAmount, Validators.maxLength(15)],
      roundingAmt: [this.defaultAmount, Validators.maxLength(15)],
      totalInvcAmt: [this.defaultAmount, Validators.maxLength(15)],
    }, {
      // validators: [this.validateRoundAmt()]
    });

    this.shopsList = this.shpSrvc.getList();

    this.filteredFromOptions = this.fromCode.valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value) : this.shopsList.slice())
        );

    this.filteredToOptions = this.toCode.valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value) : this.shopsList.slice())
        );

    this.invntryType.valueChanges.subscribe((value) => {
      const slNumber = this.invtrySrvc.getMaxRcdNum(value);
      this.SL.setValue(slNumber);
    });


//     this.roundingAmt.valueChanges.pipe(distinctUntilChanged()).subscribe((value)=>{
//       this.roundingAmt.setErrors({cannotBeLess: true});
//       if(this.getNumberValue(value) < 0)
//       {
// console.clear()
//         let amount = this.getNumberValue(this.totalAmt.value) +  this.getNumberValue(this.totalPerAmt.value) + this.getNumberValue(this.zeroAmt.value)

//         // console.log(typeof(this.getNumberValue(value)));
//         console.log(amount);
//         console.log(this.getNumberValue(value));
//         console.log(this.getNumberValue(value) - amount);
//         // console.log(this.getNumberValue(value) < 0);

//         console.log("IF")

//       }
//       else
//       {
//         console.log("ELSE")
//       }
//     });

    if (this.pageMode != 'create') {
      this.recordID = this.data.record.SL;
      this.inventoryDtlsForm.patchValue(this.data.record);
      setTimeout(() => {
        this.validateNSetFromCode(this.data.record.fromCode);
        this.validateNSetToCode(this.data.record.toCode);
      });
    } else {
      setTimeout(() => {
        this.invntryType.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(){
    this.isSmallScrnSubscription.unsubscribe();
  }

  onSelectFromCode({option}) {
    this.validateNSetFromCode(option.value);
  }

  onSelectToCode({option}) {
    this.validateNSetToCode(option.value);
  }

  validateNSetFromCode(code: string) {

    this.fromCodeFirmEle.nativeElement.value = '';

    const shop = this.shopsList.find(x => x.code.toLowerCase() == code.toLowerCase());
    if (shop) {
      this.fromCodeFirmEle.nativeElement.value = shop.firmName;
    } else {
      this.fromCode.setErrors({InvalidCode: true});
    }

  }

  validateNSetToCode(code: string) {

    this.toCodeFirmEle.nativeElement.value = '';

    const shop = this.shopsList.find(x => x.code.toLowerCase() == code.toLowerCase());
    if (shop) {
      this.toCodeFirmEle.nativeElement.value = shop.firmName;
    } else {
      this.toCode.setErrors({InvalidCode: true});
    }

  }

  private _filter(value: string): Shop[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(shop => shop.firmName.toLowerCase().includes(filterValue) || shop.code.toLowerCase().includes(filterValue));
  }

  get invntryType() {
    return this.inventoryDtlsForm.get('invntryType') as FormControl;
  }
  get SL() {
    return this.inventoryDtlsForm.get('SL') as FormControl;
  }
  get date() {
    return this.inventoryDtlsForm.get('date') as FormControl;
  }
  get fromCode() {
    return this.inventoryDtlsForm.get('fromCode') as FormControl;
  }
  get toCode() {
    return this.inventoryDtlsForm.get('toCode') as FormControl;
  }
  get cashRcredit() {
    return this.inventoryDtlsForm.get('cashRcredit') as FormControl;
  }
  get invcNo() {
    return this.inventoryDtlsForm.get('invcNo') as FormControl;
  }
  get invcDate() {
    return this.inventoryDtlsForm.get('invcDate') as FormControl;
  }
  get fiveAmt() {
    return this.inventoryDtlsForm.get('fiveAmt') as FormControl;
  }
  get fivePerAmt() {
    return this.inventoryDtlsForm.get('fivePerAmt') as FormControl;
  }
  get twelveAmt() {
    return this.inventoryDtlsForm.get('twelveAmt') as FormControl;
  }
  get twelvePerAmt() {
    return this.inventoryDtlsForm.get('twelvePerAmt') as FormControl;
  }
  get eighteenAmt() {
    return this.inventoryDtlsForm.get('eighteenAmt') as FormControl;
  }
  get eighteenPerAmt() {
    return this.inventoryDtlsForm.get('eighteenPerAmt') as FormControl;
  }
  get twntyEightAmt() {
    return this.inventoryDtlsForm.get('twntyEightAmt') as FormControl;
  }
  get twntyEightPerAmt() {
    return this.inventoryDtlsForm.get('twntyEightPerAmt') as FormControl;
  }
  get zeroAmt() {
    return this.inventoryDtlsForm.get('zeroAmt') as FormControl;
  }
  get totalAmt() {
    return this.inventoryDtlsForm.get('totalAmt') as FormControl;
  }
  get totalPerAmt() {
    return this.inventoryDtlsForm.get('totalPerAmt') as FormControl;
  }
  get roundingAmt() {
    return this.inventoryDtlsForm.get('roundingAmt') as FormControl;
  }
  get totalInvcAmt() {
    return this.inventoryDtlsForm.get('totalInvcAmt') as FormControl;
  }

  calcPerValue(percent: number, amountFld: FormControl, amountPerFld: FormControl) {
    const amount = amountFld.value;

    if (amount && !isNaN(amount)) {
      const percentValue = ((parseFloat(amount) * percent) / 100).toFixed(2);
      amountPerFld.setValue(percentValue);
    } else {
      amountFld.setValue(0.00);
      amountPerFld.setValue(0.00);
    }
    this.updateTotalValue();
    return true;
  }

  updateTotalValue() {
    let sumAmt = 0.00;
    let sumPerAmt = 0.00;

    sumAmt      += this.getNumberValue(this.fiveAmt.value);
    sumPerAmt   += this.getNumberValue(this.fivePerAmt.value);

    sumAmt      += this.getNumberValue(this.twelveAmt.value);
    sumPerAmt   += this.getNumberValue(this.twelvePerAmt.value);

    sumAmt      += this.getNumberValue(this.eighteenAmt.value);
    sumPerAmt   += this.getNumberValue(this.eighteenPerAmt.value);

    sumAmt      += this.getNumberValue(this.twntyEightAmt.value);
    sumPerAmt   += this.getNumberValue(this.twntyEightPerAmt.value);

    this.totalAmt.setValue(parseFloat('' + sumAmt).toFixed(2));
    this.totalPerAmt.setValue(parseFloat('' + sumPerAmt).toFixed(2));

    this.updateTotalInvcAmt();
  }

  updateTotalInvcAmt() {
    let totInvcAmt = 0.00;

    totInvcAmt += this.getNumberValue(this.totalAmt.value);
    totInvcAmt += this.getNumberValue(this.totalPerAmt.value);
    totInvcAmt += this.getNumberValue(this.zeroAmt.value);
    totInvcAmt += this.getNumberValue(this.roundingAmt.value);

    this.totalInvcAmt.setValue(parseFloat('' + totInvcAmt).toFixed(2));

    this.validateRoundAmt();
  }

  maxRoundingAmt(): number {
    return this.getNumberValue(this.totalAmt.value) +  this.getNumberValue(this.totalPerAmt.value) + this.getNumberValue(this.zeroAmt.value);
  }

  validateRoundAmt() {
    const roundAmt = this.getNumberValue(this.roundingAmt.value);
    if (roundAmt < 0 &&
      (roundAmt * -1) > this.maxRoundingAmt()
      ) {
      this.roundingAmt.setErrors({cannotBeLess: true});
    } else {
      this.roundingAmt.setErrors(null);
    }
  }

  private getNumberValue(number): number {

    if (number && !isNaN(number)) {
      return +parseFloat(number).toFixed(2);
    } else {
      return 0.00;
    }

  }

  save() {
    if (!this.inventoryDtlsForm.valid) {
      return false;
    }

    if (this.pageMode == 'create') {
      const saveStatus = this.invtrySrvc.saveInventory(this.inventoryDtlsForm.value);

      if (!saveStatus) {
        this.SL.setErrors({alreadyExists: true});
        return false;
      }
    } else {
      this.invtrySrvc.updateInventory(this.recordID, this.inventoryDtlsForm.value);
    }

    this.dialogRef.close('saved');
  }

  // validateRoundAmt(): ValidatorFn{

  //   return (group: FormGroup):ValidationErrors|null => {

      // let amount = this.getNumberValue(group.get('totalAmt').value) +  this.getNumberValue(group.get('totalPerAmt').value) + this.getNumberValue(group.get('zeroAmt').value);

      // if(this.getNumberValue(group.get('roundingAmt').value) < 0 && this.getNumberValue(group.get('roundingAmt').value) < amount)
      // {
      //   group.get('roundingAmt').setErrors({cannotBeLess: true});
      //   return ({cannotBeLess: true});
      // }
      // return null;
  //   }

  // }
}
