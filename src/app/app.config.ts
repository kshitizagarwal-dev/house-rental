import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
     provideFirebaseApp(() => initializeApp({"projectId":"login-dummypage","appId":"1:94900849917:web:0503da0c16d3abb2e1c294","storageBucket":"login-dummypage.firebasestorage.app","apiKey":"AIzaSyCsWlM_RBrtJZBBCzk6EI5dsWu_iwTCqbg","authDomain":"login-dummypage.firebaseapp.com","messagingSenderId":"94900849917"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),provideStorage(() => getStorage()), provideAnimationsAsync()]
};
