import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderViewComponent } from './responder-view.component';

describe('ResponderViewComponent', () => {
  let component: ResponderViewComponent;
  let fixture: ComponentFixture<ResponderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
