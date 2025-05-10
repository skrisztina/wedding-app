import { Component , OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Venue } from '../../models/venue.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { VenueService } from '../../services/venue.service';
import { ReviewService } from '../../services/review.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-wedding-venues',
  imports: [MatCardModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './wedding-venues.component.html',
  styleUrl: './wedding-venues.component.scss'
})
export class WeddingVenuesComponent implements OnInit{
  venues: Venue[] = [];
  reviews: Review[] = [];
  avgRatings: Map<string, number> = new Map();
  @Input() title: string = 'Esküvői helyszínek';
  @Output() venueSelected: EventEmitter<Venue> = new EventEmitter<Venue>();

  constructor(private venueService: VenueService, private router: Router, private reviewService: ReviewService){}

  ngOnInit(): void {
      this.venueService.getVenues().subscribe(venues => {
    this.venues = venues;

    venues.forEach(venue => {
      this.reviewService.getAvgRating(venue.id).subscribe(avg => {
        this.avgRatings.set(venue.id, avg);
      });
    });
  });
  }

  onVenueSelect(venue: Venue){
    this.router.navigate(['/reserve-venue', venue.id]);
  }

  getAvgRating(venueId: string): number {
    return this.avgRatings.get(venueId) ?? 0;
  }
}
