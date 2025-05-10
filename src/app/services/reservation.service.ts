import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, orderBy, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
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
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            guestCount
          });
        }

        return !isOverlapping;
      })
    );
  }

  getPastReservations(userId: string): Observable<Reservation[]> {
  const reservationRef = collection(this.firestore, 'Reservations');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const userReservationQuery = query(
    reservationRef,
    where('userId', '==', userId),
    orderBy('startDate', 'asc') // orderBy nélkül is működik, de ezzel optimalizálható
  );

  return from(getDocs(userReservationQuery)).pipe(
    map(snapshot => {
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
        .filter(reservation => new Date(reservation.endDate) < today); // Kézi szűrés
    })
  );
}

getUpcomingReservations(userId: string): Observable<Reservation[]> {
  const reservationRef = collection(this.firestore, 'Reservations');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // Csak a dátumot tartalmazza, idő nélkül

  const userReservationQuery = query(
    reservationRef,
    where('userId', '==', userId),
    where('startDate', '>=', todayStr), // A jövőbeli startDate szűrésére
    orderBy('startDate', 'asc') // Rendezzük a startDate szerint
  );

  return from(getDocs(userReservationQuery)).pipe(
    map(snapshot => {
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
    })
  );
}

deleteReservation(reservationId: string): Observable<void> {
    const reservationDocRef = doc(this.firestore, 'Reservations', reservationId);
    return from(deleteDoc(reservationDocRef));
  }


  updateReservation(updatedId: string, updated: Reservation): Observable<void>{
    const reservationDocRef = doc(this.firestore, 'Reservations', updatedId);

    const formatDate = (date: string): string => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

    const formattedStartDate = formatDate(updated.startDate);
    const formattedEndDate = formatDate(updated.endDate);

    const updatedData = {
      userId: updated.userId,
      venueId: updated.venueId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      guestCount: updated.guestCount
  };
  return from(updateDoc(reservationDocRef, updatedData));
  }
  
}
