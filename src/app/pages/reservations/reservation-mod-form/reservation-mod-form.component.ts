import { Component, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { Reservation } from '../../../models/reservation.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VenueService } from '../../../services/venue.service';
import { Venue } from '../../../models/venue.model';


@Component({
  selector: 'app-reservation-mod-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './reservation-mod-form.component.html',
  styleUrl: './reservation-mod-form.component.scss'
})
export class ReservationModFormComponent {
  @Input() reservation!: Reservation;
  @Output() save = new EventEmitter<Reservation>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private venueService: VenueService) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      guestCount: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservation'] && this.reservation) {
      this.venueService.getVenueById(this.reservation.venueId).subscribe(venue => {
        const maxGuests = venue.capacity;

        this.form = this.fb.group({
          startDate: [this.reservation.startDate, Validators.required],
          endDate: [this.reservation.endDate, Validators.required],
          guestCount: [
            this.reservation.guestCount,
            [Validators.required, Validators.min(1), Validators.max(maxGuests)]
          ]
        });
      });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const updated = {
        ...this.reservation,
        ...this.form.value
      };
      this.save.emit(updated);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
