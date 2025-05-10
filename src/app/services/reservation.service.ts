import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';
import { Reservation } from '../models/reservation.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private firestore: Firestore) { }

  addReservation(userId: string, venueId: string, startDate: string,endDate: string, guestCount: number ): Observable<boolean>{
    const reservationRef = collection(this.firestore, 'Reservations');
    const venueReservationQuery = query(reservationRef, where('venueId', '==', venueId));

    const formatDate = (date: string): string => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    return from(getDocs(venueReservationQuery)).pipe(
      map(snapshot => {
        let isOverlapping = false;

        snapshot.forEach(doc => {
          const data = doc.data();
          const existingStart = new Date(data['startDate']);
          const existingEnd = new Date(data['endDate']);
          const newStart = new Date(formattedStartDate);
          const newEnd = new Date(formattedEndDate);

          if (newStart < existingEnd && newEnd > existingStart) {
            isOverlapping = true;
          }
        });

        if (!isOverlapping) {
          addDoc(reservationRef, {
            userId,
            venueId,
            formattedStartDate,
            formattedEndDate,
            guestCount
          });
        }

        return !isOverlapping;
      })
    );
  }
  
}
