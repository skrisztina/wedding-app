import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private firestore: Firestore) { }

  getReviewsByVenue(venueId: string): Observable<Review[]> {
    const reviewRef = collection(this.firestore, 'Reviews');
    const reviewsQuery = query(reviewRef, where('venueId', '==', venueId));

    return collectionData(reviewsQuery, {idField: 'id'}).pipe(
          map((data: any[]) => data.map(item => ({
            id: item.id,
            userId: item.userId,
            venueId: item.venueId,
            rating: item.rating,
            comment: item.comment,
            date: item.date
          }) as Review))
        );
  }

  getAvgRating(venueId: string): Observable<number>{
    return this.getReviewsByVenue(venueId).pipe(
      map(reviews => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        return totalRating / reviews.length;
      })
    );
  }
}
