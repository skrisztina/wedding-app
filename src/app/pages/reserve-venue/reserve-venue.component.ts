import { Component, Input, OnInit } from '@angular/core';
import { Venue } from '../../models/venue.model';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Reservation } from '../../models/reservation.model';
import {MatButtonModule} from '@angular/material/button';
import { LoginUser } from '../../models/loginUser.model';
import { UserService } from '../../services/user.service';
import { VenueService } from '../../services/venue.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Subscription, map } from 'rxjs'
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reserve-venue',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatButtonModule, CommonModule, MatGridListModule, DateFormatPipe],
  templateUrl: './reserve-venue.component.html',
  styleUrl: './reserve-venue.component.scss'
})
export class ReserveVenueComponent implements OnInit{
  @Input() venue: Venue | null = null;
  reservationForm: FormGroup;
  reservations: Reservation[] = [];
  loggedInUser : User | null = null;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  reviews: Review[] = [];
  users: User[] = [];
  avgRatings: number = 0;
  reviewUsers: Map<string, string> = new Map();

  constructor(private route: ActivatedRoute, private venueService: VenueService, private fb: FormBuilder, private userService: UserService,
    private authService: AuthService, private reviewService: ReviewService, private reservationService : ReservationService, private router: Router,
    private snackBar: MatSnackBar
   ){
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      guestCount: ['', [Validators.required, Validators.min(2)]]
    })

  }

  ngOnInit(): void {
      const venueId = this.route.snapshot.paramMap.get('id');
      
      if(venueId){
        this.venueService.getVenueById(venueId).subscribe(venue => {
          this.venue = venue;

          if(this.venue){
            this.reservationForm.get('guestCount')?.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(this.venue.capacity)
            ]);
            this.reservationForm.get('guestCount')?.updateValueAndValidity();
          }
        });

         this.reviewService.getReviewsByVenue(venueId).subscribe(reviews => {
        this.reviews = reviews;

         this.reviews.forEach(review => {
         this.userService.getUserNameById(review.userId).subscribe(user => {
        this.reviewUsers.set(review.id, user);
      });
    });
      });
      this.reviewService.getAvgRating(venueId).subscribe(avg => {
        this.avgRatings = avg;
    });

     this.authSubscription = this.authService.isLoggedIn().subscribe(firebaseUser => {
      if(!firebaseUser){
        this.router.navigate(['/login']);
        return;
      }

      this.userSubscription = this.userService.getUser().subscribe({
        next: user => this.loggedInUser = user,
        error: err => {
          console.error('Hiba a felhasználó adatainak lekérdezésekor: ', err);
          this.snackBar.open('Hiba a felhasználó adatainak lekérdezésekor.', 'Bezár', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        }
      });
    });
    }
  }

  onSubmit(){
    if (this.reservationForm.valid && this.venue && this.loggedInUser) {
      const { startDate, endDate, guestCount } = this.reservationForm.value;

      this.reservationService.addReservation(this.loggedInUser.id, this.venue.id, startDate, endDate, guestCount)
      .subscribe(success => {
        if (success) {
          this.reservationForm.reset();
          this.snackBar.open('Sikeres foglalás!', 'Bezár', {
          duration: 3000,
          verticalPosition: 'top'
        });
        } else {
          this.snackBar.open('A kiválasztott időpontban már van foglalás a helyszínen', 'Bezár', {
          duration: 3000,
          verticalPosition: 'top'
        });
        }
      });
    }
  }

  getAvgRating(): number {
     return this.avgRatings;
  }

  getUserNameById(reviewId: string): string{
    return this.reviewUsers.get(reviewId) ?? 'Ismeretlen felhasználó';
  }

}
