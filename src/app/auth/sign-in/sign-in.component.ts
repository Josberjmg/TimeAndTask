import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/darktheme.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})

export default class SignInComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder)
  
  formValue = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  })
  
  IrASignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  signIn() {
    if (!this.formValue.valid) {
      return;
    }

    const { email, password } = this.formValue.value;

    this.authService.signIn(email as string, password as string).subscribe({
      next: (resp) => {
        Swal.fire({
        position: 'top',
        icon: 'success',
        title: `¡Bienvenido, ${resp.name || 'usuario'}!`,
        showConfirmButton: false,
        timer: 2500,
        customClass: {popup: 'mi-alerta-oscura'}
      }).then(() => {
        this.goToDashboard();
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Fallo al iniciar sesión',
        text: "Credenciales incorrectas",
      });
    }
  });
}  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
