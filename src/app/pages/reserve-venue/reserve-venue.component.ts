import { Component, Input, OnInit } from '@angular/core';
import { Venue } from '../../models/venue.model';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from '../../services/data.service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reserve-venue',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './reserve-venue.component.html',
  styleUrl: './reserve-venue.component.scss'
})
export class ReserveVenueComponent implements OnInit{
  @Input() venue: Venue | null = null;
  reservationForm: FormGroup;
  reservations: Reservation[];

  constructor(private route: ActivatedRoute, private dataService: DataServiceService, private fb: FormBuilder){
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
      
      if (this.venue) {
        // Ha van helyszín, beállítjuk a maximum vendégek számát
        this.reservationForm.get('guestCount')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.venue.capacity) // Beállítjuk a dinamikus validátort
        ]);
        this.reservationForm.get('guestCount')?.updateValueAndValidity(); // Érvényesítjük újra
      }
  }

  onSubmit(){
    if (this.reservationForm.valid && this.venue) {
      // A foglalás feldolgozása
      const reservationData = this.reservationForm.value;
      const lastId = this.reservations[this.reservations.length-1].id + 1;

      const isOverlapping = this.reservations.some(reservation => {
        const existingStartDate = new Date(reservation.startDate);
        const existingEndDate = new Date(reservation.endDate);
        const newStartDate = new Date(reservationData.startDate);
        const newEndDate = new Date(reservationData.endDate);
  
        // Ellenőrizzük, hogy a két időszak átfedi-e egymást
        return (newStartDate < existingEndDate && newEndDate > existingStartDate);
      });

      if(!isOverlapping){
        const reservation = new Reservation( lastId, this.venue.id, 1, reservationData.startDate, reservationData.endDate, reservationData.guestCount )

        this.dataService.addResertvation(reservation);

        this.reservationForm.reset();
      } else{
        alert('A kiválasztott időszakban már van foglalás a helyszínen.');
      }
    }
  }

}
