import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserDTO } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http.get<User[]>("http://127.0.0.1:8000/api/v1/users");
    }

    deleteUserById(userId: number) {
      return this.http.delete<any>("http://127.0.0.1:8000/api/v1/users/" + userId);
    }

    postNewUser(newUser: UserDTO){
      return this.http.post<User>("http://127.0.0.1:8000/api/v1/users", newUser);
    }
}
