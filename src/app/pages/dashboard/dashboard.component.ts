import { Component, inject } from '@angular/core';
import { Activity } from '../../interfaces/activities.entity';
import { ActivityService } from '../../services/activities.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { OverviewComponent } from "../../overview/overview.component";
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    OverviewComponent,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HeaderComponent,
    OverviewComponent,
    LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent {
  activitys: Activity[] = [];
  filteredActivitys: Activity[] = [];
  searchTitle: string = '';
  searchDate: string = '';
  newActivity: Activity = { title: '', description: '', completed: false, duration: undefined, date: new Date() };
  private activityService = inject(ActivityService)
  fb = inject(FormBuilder);
  formValue = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    date: ['', [Validators.required]],
    description: ['', [Validators.required]],
    duration: [, [Validators.required, Validators.min(1)]],
  });


  ngOnInit(): void {
    this.loadActivities();
    this.activityService.activitiesChanged$.subscribe(() => {
      this.applyFilters();
      this.loadActivities();
    });
  }
  private reorderList(list: Activity[]): Activity[] {
    return [
      ...list.filter(a => !a.completed),
      ...list.filter(a => a.completed)
    ];
  }
  applyFilters(): void {
    if (!this.searchTitle && !this.searchDate) {
      this.filteredActivitys = this.reorderList(this.activitys);
      return;
    }
    this.filteredActivitys = this.reorderList(
      this.activitys.filter(activity => {
        const matchesTitle = this.searchTitle
          ? activity.title.toLowerCase().includes(this.searchTitle.toLowerCase())
          : true;
        const matchesDate = this.searchDate
          ? this.isSameDayLocal(
            new Date(activity.date),
            new Date(this.searchDate + 'T00:00:00')
          )
          : true;
        return matchesTitle && matchesDate;
      })
    );
  }

  private isSameDayLocal(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }


  loadActivities(): void {
    this.activityService.getActivities().subscribe((activitys) => {
      this.activitys = this.reorderList(activitys);
      this.filteredActivitys = this.reorderList(activitys);
    });
  }
  deleteActivity(id: string): void {
    Swal.fire({
      title: '¿Eliminar actividad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'mi-alerta-oscura' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.activityService.deleteActivity(id).subscribe(() => {
          this.loadActivities();
          this.activityService.notifyActivitiesChanged();
        });
      }
    });
  }
  toggleActivity(activity: Activity): void {
    if (!activity.id) {
      console.error('Activity ID is undefined');
      return;
    }
    this.activityService.updateTask(activity.id, { completed: !activity.completed as boolean }).subscribe({
      next: () => {
        activity.completed = !activity.completed;
        this.applyFilters(); // <-- Esto reordena filteredActivitys también
        this.activityService.notifyActivitiesChanged();
      },
      error: (err) => {
        console.error('Error al actualizar la actividad', err);
      }
    });
  }
  private reorderActivities() {
    // Las no completadas primero, las completadas al final
    this.activitys = [
      ...this.activitys.filter(a => !a.completed),
      ...this.activitys.filter(a => a.completed)
    ];
  }
}