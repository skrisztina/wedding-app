import { Component, Input, OnInit } from '@angular/core';
import { Venue } from '../../models/venue.model';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DataServiceService } from '../../services/data.service.service';
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
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-reserve-venue',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatButtonModule, CommonModule, MatGridListModule, DateFormatPipe],
  templateUrl: './reserve-venue.component.html',
  styleUrl: './reserve-venue.component.scss'
})
export class ReserveVenueComponent implements OnInit{
  @Input() venue: Venue | null = null;
  reservationForm: FormGroup;
  reservations: Reservation[];
  loggedInUser : LoginUser | null = null;
  reviews: Review[] = [];
  users: User[] = [];

  constructor(private route: ActivatedRoute, private dataService: DataServiceService, private fb: FormBuilder, private userService: UserService ){
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      guestCount: ['', [Validators.required, Validators.min(2)]]
    })
    this.reservations = this.dataService.getReservations();

  }

  ngOnInit(): void {
      const venueId = +this.route.snapshot.paramMap.get('id')!;
      this.venue = this.dataService.getVenues().find(v => v.id == venueId) || null;
      if(this.venue !== null){
        this.reviews = this.dataService.getReviewsByVenue(this.venue?.id);
      }

      this.users = this.dataService.getUsers();
      
      if (this.venue) {
        this.reservationForm.get('guestCount')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.venue.capacity)
        ]);
        this.reservationForm.get('guestCount')?.updateValueAndValidity();
        this.userService.currentUser$.subscribe(user => {
          this.loggedInUser = user;
        })
      }
  }

  onSubmit(){
    if (this.reservationForm.valid && this.venue) {
      const reservationData = this.reservationForm.value;
      const lastId = this.reservations[this.reservations.length-1].id + 1;

      const isOverlapping = this.reservations.some(reservation => {
        const existingStartDate = new Date(reservation.startDate);
        const existingEndDate = new Date(reservation.endDate);
        const newStartDate = new Date(reservationData.startDate);
        const newEndDate = new Date(reservationData.endDate);
  
        return (newStartDate < existingEndDate && newEndDate > existingStartDate);
      });

      if(!isOverlapping){
        const reservation = new Reservation( lastId, this.venue.id, 1, reservationData.startDate, reservationData.endDate, reservationData.guestCount )

        this.dataService.addResertvation(reservation);

        this.reservationForm.reset();
        alert('Sikeres foglalás.');
      } else{
        alert('A kiválasztott időszakban már van foglalás a helyszínen.');
      }
    }
  }

  getAvgRating(venueId: number): number {
    if(this.reviews.length === 0){
      return 0;
    }
    const venueReviews = this.reviews.filter(review => review.venueId === venueId);
    const totalRating = venueReviews.reduce((acc, review) => acc+review.rating, 0);

    return totalRating/ venueReviews.length;
  }

  getUserNameById(userId: number): string{
    const user = this.users.find(u => u.id === userId);
    return user? user.name : 'Ismeretlen felhasználó';
  }

}
