import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserDTO } from '../interfaces/user.interface';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  // TODO Crear variable de entorno para la url de la api

    constructor(private http: HttpClient) { }

    getUser(): Observable<User> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<User>('http://127.0.0.1:8000/api/v1/auth/me', { headers }).pipe(
        map(response => {
          // Mapea la respuesta del endpoint a la interfaz de usuario
          return {
            username: response.username,
            email: response.email,
            phone: response.phone,
            user_id: response.user_id,
            user_rol: {
              rol_name: response.user_rol.rol_name,
              rol_id: response.user_rol.rol_id
            }
          };
        }),
        catchError(error => {
          // Maneja los errores de la llamada HTTP
          console.error('Error fetching user:', error);
          throw error;
        })
      );
    }
}
