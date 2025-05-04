import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, User, Lock, ClipboardPlus, Calendar, History, Clock, Moon } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(
    { eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ User, Lock, ClipboardPlus, Calendar, History, Clock, Moon })),
  ]
};
