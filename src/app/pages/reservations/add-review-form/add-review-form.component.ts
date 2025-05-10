import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Review } from '../../../models/review.model';
import { ReviewService } from '../../../services/review.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-add-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, MatSelectModule],
  templateUrl: './add-review-form.component.html',
  styleUrl: './add-review-form.component.scss'
})
export class AddReviewFormComponent {
  @Input() reviewData: { userId: string, venueId: string } | null = null;
  @Output() save = new EventEmitter<Review>();
  @Output() cancel = new EventEmitter<void>();
  ratings: number[] = [1, 2, 3, 4, 5];
  newReview: Review | null = null;

  form: FormGroup;

  constructor(private reviewService: ReviewService, private fb: FormBuilder){
    this.form = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  onSave(): void {
    if (this.form.valid && this.reviewData?.userId && this.reviewData.venueId ) {
      this.newReview = new Review(
        '', // review ID can be generated in the service or back-end
        this.reviewData.userId,
        this.reviewData.venueId,
        this.form.value.rating,
        this.form.value.comment,
        new Date().toISOString() // Using current date for the review date
      );
      this.save.emit(this.newReview);
    }
  }

 onCancel(): void{
  this.cancel.emit();
 }
}
