import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Venue } from '../models/venue.model';
import { map } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  constructor( private firestore: Firestore) { }

  getVenues(): Observable<Venue[]> {
    const venuesRef = collection(this.firestore, 'Venues');
    return collectionData(venuesRef, {idField: 'id'}).pipe(
      map((data: any[]) => data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        capacity: item.capacity,
        image: item.image,
        location: item.location,
        price: item.price
      }) as Venue))
    );
  }

  getVenueById(venueId: string): Observable<Venue> {
    const venueRef = doc(this.firestore, `Venues/${venueId}`);
    return from(getDoc(venueRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: data['id'],
            name: data['name'],
            description: data['description'],
            capacity: data['capacity'],
            image: data['image'],
            location: data['location'],
            price: data['price']
          } as Venue;
        } else {
          throw new Error('Venue not found');
        }
      })
    );
  }

getVenueNameById(venueId: string): Observable<string> {
  const venueDocRef = doc(this.firestore, 'Venues', venueId);
  return from(getDoc(venueDocRef)).pipe(
    map((docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data?.['name'] || 'Ismeretlen helyszín';
      } else {
        return 'Ismeretlen helyszín';
      }
    })
  );
}
}
