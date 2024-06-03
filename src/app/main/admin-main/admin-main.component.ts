import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { Chat } from '../../interfaces/chat.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent {



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
