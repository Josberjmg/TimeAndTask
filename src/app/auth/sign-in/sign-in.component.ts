import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/darktheme.service';



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
    password: ["", [Validators.required]],
  })
  
  IrASignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  signIn(){
    if( !this.formValue.valid ){
      return;
    }

    const { email, password } = this.formValue.value;
    
    this.authService.signIn( email as string, password as string ).subscribe((resp)=>{
      console.log({resp})
      this.goToDashboard();
    })
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
