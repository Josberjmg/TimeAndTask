import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, User, Lock, ClipboardPlus, Calendar, History, Clock, Moon, Trash2, ChevronLeft, ChevronRight, CheckSquare, Bell, Users, Check, CheckCircle, Info, Circle, Star } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(
    { eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({
      User,
      Lock,
      ClipboardPlus,
      Calendar,
      History,
      Clock,
      Moon,
      Trash2,
      ChevronLeft,
      ChevronRight,
      CheckSquare,
      Bell,
      Users,
      Check,
      CheckCircle,
      Info,
      Circle,
      Star})),
      { provide: LOCALE_ID, useValue: 'es' }
  ]
};
