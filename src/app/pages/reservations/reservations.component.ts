import { Component, OnInit } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationModFormComponent } from './reservation-mod-form/reservation-mod-form.component';



@Component({
  selector: 'app-reservations',
  imports: [MatCheckboxModule, MatTableModule, DateFormatPipe, MatIconModule, MatExpansionModule, CommonModule, MatRadioModule, ReactiveFormsModule, ReservationModFormComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{
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


  constructor(private reservationService: ReservationService, private authService: AuthService,
    private userService: UserService, private router: Router, private venueService: VenueService
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


}
