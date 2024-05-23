import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service'; // Import UserService
import { User, UserDTO, UserRol } from '../../../interfaces/user.interface';



@Component({
  templateUrl: './users-page.component.html',
  styles: ``
})
export class UsersPageComponent implements OnInit {

  users: User[] = [];

  newUser: UserDTO = {
    "username":"",
    "email":"",
    "phone":"",
    "password":""
  }

  showAddRow = false;

  private loadUserList(){
    this.userService.getUsers().subscribe(users => {
      this.users = users; // Assign fetched users to component property
  });
  }

  constructor(private userService: UserService) { } // Inject UserService

    ngOnInit(): void {
        this.loadUserList();
    }

  saveChanges(item: any) {
    // Guarda los cambios en el localStorage
    console.log(this.users);
  }


  deleteUser(userId: number) {
    this.userService.deleteUserById(userId).subscribe(() => {
      // User deleted successfully (handle response if needed)
      // Update local user list
    }, error => {
      console.error("Error deleting user:", error); // Handle error
    });

    this.loadUserList();
  }

  addRow(){
    this.showAddRow = true;
  }

  cancelAddRow(){
    this.showAddRow = false;
  }

  saveNewUser(){
    this.userService.postNewUser(this.newUser).subscribe(() => {
      this.showAddRow = false;

    this.newUser = {
      "username":"",
      "email":"",
      "phone":"",
      "password":""
    }

    this.loadUserList();

    }, error => {
      console.error("Error posting user:", error); // Handle error
    });
  }





}
