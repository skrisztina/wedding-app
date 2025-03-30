import { Component , OnInit, Output, EventEmitter, Input, input} from '@angular/core';
import { DataServiceService } from '../../services/data.service.service';
import { Venue } from '../../models/venue.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wedding-venues',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './wedding-venues.component.html',
  styleUrl: './wedding-venues.component.scss'
})
export class WeddingVenuesComponent implements OnInit{
  venues: Venue[] = [];
  @Input() title: string = 'Esküvői helyszínek';
  @Output() venueSelected: EventEmitter<Venue> = new EventEmitter<Venue>();

  constructor(private dataService: DataServiceService, private router: Router){}

  ngOnInit(): void {
      this.venues = this.dataService.getVenues();
  }

  onVenueSelect(venue: Venue){
    this.router.navigate(['/reserve-venue', venue.id]);
  }
}
