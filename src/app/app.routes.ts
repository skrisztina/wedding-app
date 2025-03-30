import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { WeddingVenuesComponent } from './pages/wedding-venues/wedding-venues.component';
import { ReserveVenueComponent } from './pages/reserve-venue/reserve-venue.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'wedding-venues', component: WeddingVenuesComponent },
    { path: 'reservations', component: ReservationsComponent },
    { path: 'reserve-venue/:id', component: ReserveVenueComponent },
    { path: 'profile/:id', component: ProfileComponent },

    { path: '', redirectTo: 'home', pathMatch: 'full'},

    { path: '**', component: PageNotFoundComponent },


];
