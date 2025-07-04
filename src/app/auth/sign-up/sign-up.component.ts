import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../services/darktheme.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export default class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  fb = inject(FormBuilder);
  formValue = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
  });

  signUp() {
    if (!this.formValue.valid) {
      return;
    }

    const { email, password, name } = this.formValue.value;


    this.authService.signUp({ name: name!, email: email!, password: password! }).subscribe((user)=>{
      Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
      confirmButtonText: 'Aceptar',
      customClass: {popup: 'mi-alerta-oscura'}
    }).then(() => {
      this.goToSignIn();
    });
  });
}

  goToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}