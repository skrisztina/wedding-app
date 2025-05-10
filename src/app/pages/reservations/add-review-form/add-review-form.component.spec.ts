import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviewFormComponent } from './add-review-form.component';

describe('AddReviewFormComponent', () => {
  let component: AddReviewFormComponent;
  let fixture: ComponentFixture<AddReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
