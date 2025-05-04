import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../services/darktheme.service';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentDate = format (new Date(), 'EEEE, MMMM do yyyy');
  currentTime:string='';
  constructor(private router: Router, private themeService: ThemeService){}

  ngOnInit(): void {
    this.updateTime();
    setInterval(()=> this.updateTime(),1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = format(now, 'hh:mm:ss a');
  }

  IrASignIn() {
    this.router.navigate(['/auth/sign-in']);
  }
  signOut() {
    console.log('Sign Out clicked');
    this.IrASignIn();
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
