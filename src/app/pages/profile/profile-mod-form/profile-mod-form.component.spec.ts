import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileModFormComponent } from './profile-mod-form.component';

describe('ProfileModFormComponent', () => {
  let component: ProfileModFormComponent;
  let fixture: ComponentFixture<ProfileModFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileModFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
