import { Injectable } from '@angular/core';
import { Venue } from '../models/venue.model';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  venues: Venue[] = [
    new Venue("1", "Romantikus kastély", "Budapest", 200, 4000, "venue-images/castle-venue.jpg", "Egy gyönyörű kastély a Duna partján, amely eleganciát és romantikát sugároz"),
    new Venue("2", "Tóparti kert", "Velence", 100, 3500, "venue-images/lake-venue.jpg", "Egy csodálatos tóparti helyszín, ahol a természet közelsége felejthetetlen élményt nyújt."),
    new Venue("3", "Modern Lovas tanya", "Debrecen", 250, 4500, "venue-images/horse-venue.jpg", "Elegáns és modern lovas tanya, ahol a legfontosabb napját a természet és a fennséges lovaink társaságában töltheti."),
    new Venue("4", "Hegyi Panorámás szőlőbirtok", "Eger", 150, 4000, "venue-images/mountain-venue.jpg", "Festői hegyi kilátás, természetközeli esküvői élmény, finom kézműves borok."),
    new Venue("5", "Városi sportcsarnok", "Szeged", 300, 2500, "venue-images/sportshall-venue.jpg", "Egyszerű, de nagyszerű, könnyen személyre és alkalomra szabható, tágas rendezvényterem, kiváló megvilágítással.")
  ];

  users: User[] = [
    new User("1","Kovács Péter", "Férfi", "peter.kovacs@example.com", "06301234567"), //"peterpassword"
    new User("2", "Nagy Anna", "Nő", "anna.nagy@example.com", "06201234567"), //"annapassword",
    new User("3", "Szabó Bence", "Férfi", "bence.szabo@example.com", "06701234567"), //"bencepassword"
    new User("4", "Tóth Eszter", "Nő", "eszter.toth@example.com", "06309876543"), //"eszterpassword"
    new User("5", "Horváth Dávid", "Férfi", "david.horvath@example.com", "06209876543") //"davidpassword"
  ];

  reservations: Reservation[] = [
    new Reservation("1", "1", "2", "2025-03-29", "2025-03-29", 100),
    new Reservation("2", "3", "1", "2025-01-11", "2025-01-12", 150),
    new Reservation("3", "2", "4", "2025-08-05", "2025-08-06", 80),
    new Reservation("4", "5", "3", "2025-09-10", "2025-09-11", 200),
    new Reservation("5", "4", "5", "2025-06-15", "2025-06-15", 120)
  ];

  reviews: Review[] = [
    new Review("1", "2", "1", 5, "Csodálatos helszín, minden tökéletes volt!", "2025-01-16"),
    new Review("2", "1", "3", 4, "Nagyon szép, de lehetne nagyobb a parkoló.", "2025-02-06"),
    new Review("3", "4", "2", 5, "A tóparti esküvőnk felejthetetlen élmény volt!", "2025-03-30"),
    new Review("4", "3", "5", 4, "Gyönyörű helyszín, jó kiszolgálás", "2025-03-12"),
    new Review("5", "5", "4", 5, "Csodálatos panoráma, örökre szóló élmény.", "2025-02-20")
  ];

  constructor() { }

  getVenues(): Venue[] {
    return this.venues;
  }
  
  getReservations(): Reservation[] {
    return this.reservations;
  }

  addResertvation(reservation: Reservation){
    this.reservations.push(reservation);
  }

  getUsers(): User[]{
    return this.users;
  }

  checkIfUserExists(email: string): boolean{
    return this.users.some(user => user.email === email);
  }

  addUser(user: User){
    this.users.push(user);
  }

  getUserByEmail(email: string): User | undefined{
    return this.users.find(user => user.email === email);
  }

  updateUser(user: User){
    const index = this.users.findIndex(u => u.id === user.id);
    if(index !== -1){
      this.users[index] = { ...this.users[index], ...user};
    }
  }

  getReviewsByVenue(venueId: string){
    return this.reviews.filter(review => review.venueId === venueId);
  }

  getReviews(): Review[]{
    return this.reviews;
  }
}
