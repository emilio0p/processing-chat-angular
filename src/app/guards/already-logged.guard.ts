import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirigir al usuario a la página principal si ya está autenticado
      this.router.navigate(['/main']);
      return false;
    }
    return true;
  }
}

