import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersDetailsComponent } from './vouchers-details.component';

describe('VouchersDetailsComponent', () => {
  let component: VouchersDetailsComponent;
  let fixture: ComponentFixture<VouchersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
