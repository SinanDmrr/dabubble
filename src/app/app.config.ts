import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"dabubble-105cd","appId":"1:411368830374:web:916a255d17e91d049a4b67","storageBucket":"dabubble-105cd.firebasestorage.app","apiKey":"AIzaSyC5OWaF-FjHeX2WkCN7axrT8Vit8yoDiCc","authDomain":"dabubble-105cd.firebaseapp.com","messagingSenderId":"411368830374"}))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
