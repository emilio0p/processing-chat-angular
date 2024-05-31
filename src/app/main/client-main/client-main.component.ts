import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Chat } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css'
})
export class ClientMainComponent implements OnInit{


  user: User | undefined;
  selectedChat: Chat | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );


  }

  onChatSelected(chat: Chat){
    this.selectedChat=chat;
  }



}
