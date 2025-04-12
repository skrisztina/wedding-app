import { Component , OnInit, Output, EventEmitter, Input} from '@angular/core';
import { DataServiceService } from '../../services/data.service.service';
import { Venue } from '../../models/venue.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-wedding-venues',
  imports: [MatCardModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './wedding-venues.component.html',
  styleUrl: './wedding-venues.component.scss'
})
export class WeddingVenuesComponent implements OnInit{
  venues: Venue[] = [];
  reviews: Review[] = [];
  @Input() title: string = 'Esküvői helyszínek';
  @Output() venueSelected: EventEmitter<Venue> = new EventEmitter<Venue>();

  constructor(private dataService: DataServiceService, private router: Router){}

  ngOnInit(): void {
      this.venues = this.dataService.getVenues();
      this.reviews = this.dataService.getReviews();
  }

  onVenueSelect(venue: Venue){
    this.router.navigate(['/reserve-venue', venue.id]);
  }

  getAvgRating(venueId: number): number {
    if(this.reviews.length === 0){
      return 0;
    }
    const venueReviews = this.reviews.filter(review => review.venueId === venueId);
    const totalRating = venueReviews.reduce((acc, review) => acc+review.rating, 0);

    return totalRating/ venueReviews.length;


  }
}
