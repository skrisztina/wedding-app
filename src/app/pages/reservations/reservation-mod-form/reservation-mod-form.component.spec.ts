import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationModFormComponent } from './reservation-mod-form.component';

describe('ReservationModFormComponent', () => {
  let component: ReservationModFormComponent;
  let fixture: ComponentFixture<ReservationModFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationModFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationModFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
