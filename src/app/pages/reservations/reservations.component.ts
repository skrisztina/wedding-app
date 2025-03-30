import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data.service.service';
import { Reservation } from '../../models/reservation.model';
import { Venue } from '../../models/venue.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateFormatPipe } from '../../pipes/date-format.pipe';



@Component({
  selector: 'app-reservations',
  imports: [MatCheckboxModule, MatTableModule, DateFormatPipe],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{
  reservations: Reservation [] = [];
  venues: Venue[] = [];
  displayedColumns: string[] = ['select', 'id', 'venueName', 'startDate', 'endDate', 'guestCount'];
  selectedReservations: Set<number> = new Set();

  constructor(private dataService: DataServiceService){}

  ngOnInit(): void {
      this.reservations = this.dataService.getReservations();
      this.venues = this.dataService.getVenues();

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

}
