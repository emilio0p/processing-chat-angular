import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface'
import swal from 'sweetalert'
import { ToastrService } from 'ngx-toastr';

interface LoginResponse {
  access_token: string;
  token_type: string;
  // Add additional user information if included in response
  // user: { id: number, username: string, ... };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private router:Router, private toastrService: ToastrService) { }

login(username: string, password: string) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  this.http.post<LoginResponse>('http://127.0.0.1:8000/api/v1/auth/login', formData, { headers })
    .subscribe(response => {
      // Handle successful login response
      localStorage.setItem('access_token', response['access_token']);
      this.router.navigate(['/main/home']);
      this.toastrService.success('¡Has iniciado sesión correctamente!','',{
        timeOut: 1500,
        positionClass: 'toast-bottom-right',
        progressBar: true
      });
    }, error => {
      swal("¡Credenciales incorrectas!", "El correo o la contraseña no es correcta...", "error");
    });
}


  logout(){
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
    this.toastrService.error('¡Has cerrado sesión correctamente!','',{
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
      progressBar: true
    });
  }

  private validarToken(token: string): Observable<User | Error> {
    const url = 'http://127.0.0.1:8000/api/v1/auth/me'; // Reemplaza con la URL real
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<User | Error>(url, { headers });
  }

  // TODO Cambiar el método para que compruebe realmente si el token es válido o no para evitar intrusos
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false; // Usuario no está logueado
    }

    const usuario = this.validarToken(token);

    // En lugar de devolver el observable, extraer el usuario y verificar si existe
    if (usuario) {
      return true; // Usuario logueado
    } else {
      return false; // Token no válido o usuario no encontrado
    }
  }

  // isLoggedIn(){
  //   return localStorage.getItem('access_token');
  // }

  isAdminLoggedIn(): Observable<boolean> {
  if (this.isLoggedIn()) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', { headers }).pipe(
      map(response => response.user_rol.rol_name.toLowerCase() === "admin"),
      catchError(error => {
        console.error(error);
        return of(false);
      })
    );
  } else {
    alert('No has iniciado sesión como administrador');
    return of(false);
  }
}

  isClientLoggedIn(): Observable<boolean> {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', { headers }).pipe(
        map(response => response.user_rol.rol_name.toLowerCase() === "user"),
        catchError(error => {
          console.error(error);
          return of(false);
        })
      );
    } else {
      alert('No has iniciado sesión como cliente');
      return of(false);
    }
  }

  getCurrentUserId(): Observable<number> {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', { headers }).pipe(
        map(response => response.user_id)
      );
    } else {
      alert('No has iniciado sesión');
      return of(0);
    }
  }



}
