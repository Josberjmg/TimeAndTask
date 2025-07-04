import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ActivityService } from '../../services/activities.service';
import { Activity } from '../../interfaces/activities.entity';
import { CalendarDay } from '../../interfaces/calendar.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/darktheme.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  isLoading = false;
  loadError = false;
  private activitiesSub?: Subscription;

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnDestroy(): void {
    this.activitiesSub?.unsubscribe();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private isSameDayLocal(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

  generateCalendar(): void {
    this.isLoading = true;
    this.loadError = false;
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.activitiesSub?.unsubscribe(); // Cancela la suscripción anterior si existe

    this.activitiesSub = this.activityService.getActivitiesForMonth(year, month).subscribe({
      next: allActivities => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        this.calendarDays = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const isCurrentMonth = currentDate.getMonth() === month;
          const isToday = this.isToday(currentDate);
          const activities = allActivities.filter(a => {
            const d = new Date(a.date);
            return this.isSameDayLocal(d, currentDate);
        });

          this.calendarDays.push({
            date: new Date(currentDate),
            isCurrentMonth,
            isToday,
            activities
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
      }
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getMonthYearDisplay(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  getMoreActivitiesText(activities: Activity[]): string {
    return activities.map(a => a.title).join(', ');
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'meeting':
        return 'users';
      case 'event':
        return 'calendar';
      case 'task':
        return 'check-square';
      case 'reminder':
        return 'bell';
      default:
        return 'calendar';
    }
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}