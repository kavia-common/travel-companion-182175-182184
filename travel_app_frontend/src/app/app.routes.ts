import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Home · Travel Companion', loadComponent: () => import('./pages/home.page').then(m => m.HomePageComponent) },
  { path: 'search', title: 'Search · Travel Companion', loadComponent: () => import('./pages/search.page').then(m => m.SearchPageComponent) },
  { path: 'destinations/:id', title: 'Destination · Travel Companion', loadComponent: () => import('./pages/destination.page').then(m => m.DestinationPageComponent) },
  { path: 'itineraries', title: 'Itineraries · Travel Companion', loadComponent: () => import('./pages/itineraries.page').then(m => m.ItinerariesPageComponent) },
  { path: 'bookings', title: 'Bookings · Travel Companion', loadComponent: () => import('./pages/bookings.page').then(m => m.BookingsPageComponent) },
  { path: '**', title: 'Not Found · Travel Companion', loadComponent: () => import('./pages/not-found.page').then(m => m.NotFoundPageComponent) },
];
