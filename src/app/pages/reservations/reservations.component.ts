import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { Venue } from '../../models/venue.model';
import { User } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Subscription, map } from 'rxjs'
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { VenueService } from '../../services/venue.service';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReservationModFormComponent } from './reservation-mod-form/reservation-mod-form.component';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { AddReviewFormComponent } from "./add-review-form/add-review-form.component";


@Component({
  selector: 'app-reservations',
  imports: [MatCheckboxModule, MatTableModule, DateFormatPipe, MatIconModule, MatExpansionModule, CommonModule, MatRadioModule, ReactiveFormsModule, ReservationModFormComponent, FormsModule, AddReviewFormComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit, OnDestroy{
  loggedInUser : User | null = null;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  venues: Venue[] = [];
  futureReservations : Reservation [] = [];
  pastReservations: Reservation [] = [];
  displayedColumns: string[] = ['select', 'id', 'venueName', 'startDate', 'endDate', 'guestCount', 'action'];
  selectedReservations: Set<string> = new Set();
  reservationVenues: Map<string, string> = new Map();
  editingReservation: Reservation | null = null;
  selectedReservationId: string | null = null;
  reviewData: { userId: string, venueId: string } | null = null;
  isReviewFormVisible: boolean = false;


  constructor(private reservationService: ReservationService, private authService: AuthService,
    private userService: UserService, private router: Router, private venueService: VenueService,
    private reviewService: ReviewService
  ){}

  ngOnInit(): void {
  this.authSubscription = this.authService.isLoggedIn().subscribe(firebaseUser => {
    if (!firebaseUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userSubscription = this.userService.getUser().subscribe({
      next: user => {
        if (!user) {
          console.error('Nincs bejelentkezett felhasználó.');
          this.router.navigate(['/login']);
          return;
        }

        this.loggedInUser = user;
        this.loadReservations();
      },
      error: err => {
        console.error('Hiba a felhasználó adatainak lekérdezésekor: ', err);
        this.router.navigate(['/login']);
      }
    });
  });
}


  getVenueName(venueId: string):string{
    return this.reservationVenues.get(venueId) ?? 'Ismeretlen helyszín';
  }

  onCheckboxChange(reservationId: string){
    if(this.selectedReservations.has(reservationId)){
      this.selectedReservations.delete(reservationId);
    } else {
      this.selectedReservations.add(reservationId);
    }
  }

  isChecked(reservationId: string): boolean {
    return this.selectedReservations.has(reservationId);
  }

  isPastReservation(reservation: Reservation):boolean{
    const currentDate = new Date();
    const dateEnd = new Date(reservation.endDate);
    return dateEnd < currentDate;
  }

  deleteSelected(): void {
  if (this.selectedReservations.size === 0) {
    console.log('Nincs kijelölt foglalás a törléshez.');
    return;
  }

  this.selectedReservations.forEach(reservationId => {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        console.log(`Foglalás ${reservationId} törölve.`);
        this.selectedReservations.delete(reservationId);
      },
      error: err => {
        console.error(`Hiba a ${reservationId} törlésénél: `, err);
      }
    });
  });

  this.loadReservations();

  this.selectedReservations.clear();
  
}

private loadReservations(): void {
  if (!this.loggedInUser) return;

  this.reservationService.getPastReservations(this.loggedInUser.id).subscribe(reservations => {
    this.pastReservations = reservations;
    this.pastReservations.forEach(reservation => {
      this.venueService.getVenueNameById(reservation.venueId).subscribe(venue => {
        this.reservationVenues.set(reservation.venueId, venue);
      });
    });
  });

  this.reservationService.getUpcomingReservations(this.loggedInUser.id).subscribe(reservations => {
    this.futureReservations = reservations;
    this.futureReservations.forEach(reservation => {
      this.venueService.getVenueNameById(reservation.venueId).subscribe(venue => {
        this.reservationVenues.set(reservation.venueId, venue);
      });
    });
  });
}

editReservation(reservation: Reservation): void {
  this.editingReservation = { ...reservation }; // másolat
}

onReservationSave(updated: Reservation): void {
  this.reservationService.updateReservation(updated.id, updated).subscribe({
    next: () => {
      this.editingReservation = null;
      this.loadReservations();
    },
    error: err => {
      console.error('Hiba a foglalás mentésekor:', err);
    }
  });
}

onReservationCancel(): void {
  this.editingReservation = null;
}

writeReview(){
     if (this.selectedReservationId) {
      const selectedReservation = this.pastReservations.find(reservation => reservation.id === this.selectedReservationId);
      if (selectedReservation) {
        this.reviewData = {
          userId: this.loggedInUser?.id ?? '',
          venueId: selectedReservation.venueId,
        };
        this.isReviewFormVisible = true;
      }
    }
  }

  onReviewSubmit(review: Review){
    if (this.loggedInUser && this.reviewData) {
      const newReview = new Review(
        "",
        this.loggedInUser.id,
        this.reviewData.venueId,
        review.rating,
        review.comment,
        new Date().toISOString() // Aktuális dátum
      );

      this.reviewService.addReview(newReview).subscribe({
        next: () => {
          console.log('Vélemény mentve.');
          this.reviewData = null;
          this.selectedReservationId = null;
          this.isReviewFormVisible = false;
        },
        error: (err) => {
          console.error('Hiba a vélemény mentésekor:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
      this.editingReservation = null;
      this.selectedReservationId = null;
      this.isReviewFormVisible = false;
  }

  onReviewCancel(){
    this.selectedReservationId = null;
    this.isReviewFormVisible = false;
  }

}
