import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenVoucherListComponent } from './gen-voucher-list.component';

describe('GenVoucherListComponent', () => {
  let component: GenVoucherListComponent;
  let fixture: ComponentFixture<GenVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
