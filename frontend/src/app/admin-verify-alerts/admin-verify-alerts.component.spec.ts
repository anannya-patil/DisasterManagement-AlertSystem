import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerifyAlertsComponent } from './admin-verify-alerts.component';

describe('AdminVerifyAlertsComponent', () => {
  let component: AdminVerifyAlertsComponent;
  let fixture: ComponentFixture<AdminVerifyAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVerifyAlertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVerifyAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
