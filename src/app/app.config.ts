import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "wedding-app-d1b57", appId: "1:1041919180900:web:4f5c271d74b36417d79f71", storageBucket: "wedding-app-d1b57.firebasestorage.app", apiKey: "AIzaSyDElVMmo9LLzX5pMAt2pBDpi7S9A7gxo6U", authDomain: "wedding-app-d1b57.firebaseapp.com", messagingSenderId: "1041919180900" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
