import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data.service.service';
import { Reservation } from '../../models/reservation.model';
import { Venue } from '../../models/venue.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reservations',
  imports: [MatCheckboxModule, MatTableModule, DateFormatPipe, MatIconModule, MatExpansionModule, CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{
  reservations: Reservation [] = [];
  venues: Venue[] = [];
  futureReservations : Reservation [] = [];
  pastReservations: Reservation [] = [];
  displayedColumns: string[] = ['select', 'id', 'venueName', 'startDate', 'endDate', 'guestCount', 'action'];
  selectedReservations: Set<number> = new Set();

  constructor(private dataService: DataServiceService){}

  ngOnInit(): void {
      this.reservations = this.dataService.getReservations();
      this.venues = this.dataService.getVenues();

      const currentDate = new Date();
      this.futureReservations = this.reservations.filter(res => new Date(res.endDate) >= currentDate);
      this.pastReservations = this.reservations.filter(res => new Date(res.endDate) < currentDate);

  }

  getVenueName(venueId: number):string{
    const venue = this.venues.find(v => v.id === venueId);
    return venue ? venue.name : 'N/A';
  }

  onCheckboxChange(reservationId: number){
    if(this.selectedReservations.has(reservationId)){
      this.selectedReservations.delete(reservationId);
    } else {
      this.selectedReservations.add(reservationId);
    }
  }

  isChecked(reservationId: number): boolean {
    return this.selectedReservations.has(reservationId);
  }

  isPastReservation(reservation: Reservation):boolean{
    const currentDate = new Date();
    const dateEnd = new Date(reservation.endDate);
    return dateEnd < currentDate;
  }

}
