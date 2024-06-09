import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Chat } from '../../interfaces/chat.interface';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css'
})
export class ClientMainComponent implements OnInit{


  user: User | undefined;
  selectedChat: Chat | undefined;
  socket: Socket | undefined;

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


    console.log(this.selectedChat);


  }

  onChatSelected(chat: Chat){
    this.selectedChat=chat;
  }



}
