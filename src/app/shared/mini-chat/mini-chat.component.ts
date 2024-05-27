import { Component, Input } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-mini-chat',
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.css'
})
export class MiniChatComponent {
  @Input() chat: Chat | undefined; // Chat a mostrar
  @Input() tipoUsuario: string = "";
}
