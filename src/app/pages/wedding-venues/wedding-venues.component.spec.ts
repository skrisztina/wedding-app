import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingVenuesComponent } from './wedding-venues.component';

describe('WeddingVenuesComponent', () => {
  let component: WeddingVenuesComponent;
  let fixture: ComponentFixture<WeddingVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingVenuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
