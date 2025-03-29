import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { WeddingVenuesComponent } from './pages/wedding-venues/wedding-venues.component';
import { MenuComponent } from './shared/menu/menu.component';
import { ReserveVenueComponent } from './pages/reserve-venue/reserve-venue.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, LoginComponent, RegisterComponent, ProfileComponent, ReservationsComponent, WeddingVenuesComponent, MenuComponent, ReserveVenueComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wedding-app';
}
