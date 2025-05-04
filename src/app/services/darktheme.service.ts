import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
    private darkMode = false;

    toggleDarkMode():void {
        this.darkMode= !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
    }

    isDarkMode(): boolean {
        return this.darkMode;
    }
}