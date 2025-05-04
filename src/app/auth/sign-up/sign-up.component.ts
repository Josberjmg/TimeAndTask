import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../services/darktheme.service';
import { AuthService } from '../../services/auth.service';

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
    password: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  signUp() {
    if (!this.formValue.valid) {
      return;
    }

    const { email, password, name } = this.formValue.value;


    this.authService.signUp({ name: name!, email: email!, password: password! }).subscribe((user)=>{
      // todo: Mostrar u mensaje de registro exitoso
      console.log({user})
      this.goToSignIn()
    })
  }

  goToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}