import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'wedding-venues',
        loadComponent: () => import('./pages/wedding-venues/wedding-venues.component').then(m => m.WeddingVenuesComponent)
    },
    {
        path: 'reservations',
        loadComponent: () => import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'reserve-venue/:id',
        loadComponent: () => import('./pages/reserve-venue/reserve-venue.component').then(m => m.ReserveVenueComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile/:id',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },

    { path: '', redirectTo: 'home', pathMatch: 'full'},

    { path: '**', component: PageNotFoundComponent },


];
