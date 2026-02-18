import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterFiltersComponent } from './disaster-filters.component';

describe('DisasterFiltersComponent', () => {
  let component: DisasterFiltersComponent;
  let fixture: ComponentFixture<DisasterFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisasterFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisasterFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
