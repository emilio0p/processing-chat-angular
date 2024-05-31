import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-big-chat',
  templateUrl: './big-chat.component.html',
  styleUrl: './big-chat.component.css'
})
export class BigChatComponent{
  @Input() chat: Chat | undefined; // Selected chat data
  @Input() usuarioHost: User |undefined;


}
