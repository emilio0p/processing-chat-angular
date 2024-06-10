import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserDTO } from '../interfaces/user.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAllUsers() {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<User[]>(`${this.apiUrl}/api/v1/users/`, {headers});
    }

    getUser(): Observable<User> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get<User>(`${this.apiUrl}/api/v1/auth/me`, { headers }).pipe(
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
