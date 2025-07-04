import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../services/darktheme.service';
import Swal from 'sweetalert2';
import { es } from 'date-fns/locale';
import { ActivityService } from '../services/activities.service';
import { Activity } from '../interfaces/activities.entity';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  activitys: Activity[] = [];
  private activityService = inject(ActivityService)
  currentDate = format(new Date(), 'EEEE, d MMMM yyyy', { locale: es });
  currentTime: string = '';
  constructor(private router: Router, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.loadActivities();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = format(now, 'hh:mm:ss a');
  }

  IrASignIn() {
    this.router.navigate(['/auth/sign-in']);
  }
  IrCalendar() {
    this.router.navigate(['/calendar']);
  }
  signOut() {
    const isDark = document.body.classList.contains('dark-mode');
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      customClass: isDark ? { popup: 'mi-alerta-oscura' } : {}
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.IrASignIn();
      }
    });
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
  async abrirModalAgregarActividad() {
    const isDark = document.body.classList.contains('dark-mode');
    const { value: formValues } = await Swal.fire({
      title: 'Nueva Actividad',
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Título" maxlength="40">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Descripción"></textarea>
        <input id="swal-duration" type="number" min="1" class="swal2-input" placeholder="Duración (min)">
        <input id="swal-date" type="date" class="swal2-input" placeholder="Fecha">
        <input id="swal-time" type="time" class="swal2-input" placeholder="Hora">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Añadir actividad',
      cancelButtonText: 'Cancelar',
      customClass: isDark ? { popup: 'mi-alerta-oscura' } : {},
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        const description = (document.getElementById('swal-description') as HTMLTextAreaElement).value;
        const duration = Number((document.getElementById('swal-duration') as HTMLInputElement).value);
        const date = (document.getElementById('swal-date') as HTMLInputElement).value;
        const time = (document.getElementById('swal-time') as HTMLInputElement).value;
        if (!title || !description || !duration || !date || !time) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return;
        }
        return { title, description, duration, date, time };
      }
    });

    if (formValues) {
      // Validar fecha
      const fechaValida = formValues.date && !isNaN(new Date(formValues.date).getTime());
      const horaValida = /^([01]\d|2[0-3]):([0-5]\d)$/.test(formValues.time);
      if (!fechaValida || !horaValida) {
        Swal.fire('Fecha u hora inválida', 'Selecciona una fecha y hora válida', 'error');
        return;
      }
      const fechaHora = new Date(`${formValues.date}T${formValues.time}:00`);
      this.activityService.createActivity({
        title: formValues.title,
        description: formValues.description,
        completed: false,
        duration: formValues.duration,
        date: fechaHora,
      }).subscribe(() => {
        this.loadActivities();
        this.activityService.notifyActivitiesChanged();
        Swal.fire('¡Actividad añadida!', '', 'success');
      });
    }
  }
  loadActivities(): void {
    this.activityService.getActivities().subscribe((activitys) => (this.activitys = activitys))
  }
}
