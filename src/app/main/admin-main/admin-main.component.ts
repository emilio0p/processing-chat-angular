import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { Chat } from '../../interfaces/chat.interface';
import { UserService } from '../../services/user.service';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent implements OnInit{



  user: User | undefined;
  selectedChat: Chat | undefined;
  socket: Socket | undefined;
  showSidebar: boolean = true;


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      user => {
        this.user = user;
        this.socket = io('http://localhost:3000' , { query: { userId: this.user.user_id } });
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );


  }

  onChatSelected(chat: Chat){
    this.selectedChat=chat;
    this.showSidebar = false;
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }




}
