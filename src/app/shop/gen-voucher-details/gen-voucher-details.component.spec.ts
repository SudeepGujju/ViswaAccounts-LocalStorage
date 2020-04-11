import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenVoucherDetailsComponent } from './gen-voucher-details.component';

describe('GenVoucherDetailsComponent', () => {
  let component: GenVoucherDetailsComponent;
  let fixture: ComponentFixture<GenVoucherDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenVoucherDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenVoucherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
