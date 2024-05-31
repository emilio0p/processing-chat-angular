import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface'

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


  constructor(private http: HttpClient, private router:Router) { }

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
    }, error => {
      console.error("No se ha podido iniciar sesión.")
    });
}


  logout(){
    alert('BIEN');
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(){
    return localStorage.getItem('access_token');
  }

  // isLoggedIn(): Observable<boolean> {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) {
  //     return of(false);
  //   }

  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', { headers }).pipe(
  //     map(response => {
  //       alert('Bienvenido ' + response.username);
  //       return true;
  //     }),
  //     catchError(error => {
  //       alert('No has iniciado sesión, o tu sesión ha expirado');
  //       return of(false);
  //     })
  //   );
  // }

  // isLoggedIn(){
  //   let loggedIn = false;

  //   if(localStorage.getItem('access_token')){
  //     const token = localStorage.getItem('access_token');
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //     this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', {headers}).subscribe(
  //       response => {
  //         alert('Bienvenido ' + response.username);
  //         loggedIn = true;
  //       }, error => {
  //         alert('No has iniciado sesión, o tu sesión ha expirado');
  //         loggedIn = false;
  //       }
  //     )

  //   } else {
  //     alert('No has iniciado sesión');
  //     return false;
  //   }
  //   return loggedIn;
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
